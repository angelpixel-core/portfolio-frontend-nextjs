import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import orderModel from "@/domains/order/model";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
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

  const { id } = await context.params;
  const order = await orderModel.findAdminById(id);

  if (!order) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, order });
};
