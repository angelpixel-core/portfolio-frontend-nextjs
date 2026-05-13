import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import accessModel from "@/domains/access/model";
import orderAdminActionModel from "@/domains/order-admin-action/model";
import orderModel from "@/domains/order/model";
import userModel from "@/domains/user/model";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import { sendPaymentAccessEmail } from "@/services/payments/accessEmail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ActionSchema = z.object({
  action: z.enum(["set_status", "link_user", "grant_access"]),
  status: z.enum(["pending", "paid", "failed"]).optional(),
  email: z.string().email().optional(),
  reason: z.string().trim().max(400).optional(),
});

export const POST = async (request: NextRequest, context: RouteContext) => {
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.ORDERS_MANAGE
  );
  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = ActionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { id } = await context.params;
  const before = await orderModel.findAdminById(id);

  if (!before) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  const { action, email, reason, status } = parsed.data;

  if (action === "set_status") {
    if (!status) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    await orderModel.adminSetStatus(id, status);

    if (status === "paid") {
      const targetEmail = email ?? before.email;
      if (targetEmail) {
        const user = await userModel.findOrCreateByEmail(targetEmail);
        await orderModel.attachUser(id, user.id, targetEmail);
        await accessModel.grantAccess({
          userId: user.id,
          productKey: before.productKey,
        });
        await sendPaymentAccessEmail({
          toEmail: targetEmail,
          orderId: id,
          productKey: before.productKey,
        });
      }
    }
  }

  if (action === "link_user") {
    const targetEmail = email ?? before.email;

    if (!targetEmail) {
      return NextResponse.json(
        { ok: false, error: "missing_email" },
        { status: 400 }
      );
    }

    const user = await userModel.findOrCreateByEmail(targetEmail);
    await orderModel.attachUser(id, user.id, targetEmail);
  }

  if (action === "grant_access") {
    let userId = before.userId;
    let targetEmail = before.email;

    if (!userId) {
      targetEmail = email ?? before.email;
      if (!targetEmail) {
        return NextResponse.json(
          { ok: false, error: "missing_email" },
          { status: 400 }
        );
      }

      const user = await userModel.findOrCreateByEmail(targetEmail);
      userId = user.id;
      await orderModel.attachUser(id, user.id, targetEmail);
    }

    await accessModel.grantAccess({
      userId,
      productKey: before.productKey,
    });

    if (targetEmail) {
      await sendPaymentAccessEmail({
        toEmail: targetEmail,
        orderId: id,
        productKey: before.productKey,
      });
    }
  }

  const after = await orderModel.findAdminById(id);
  await orderAdminActionModel.recordAction({
    orderId: id,
    adminEmail,
    action,
    reason,
    beforeState: JSON.stringify(before),
    afterState: JSON.stringify(after),
  });

  return NextResponse.json({ ok: true, order: after });
};
