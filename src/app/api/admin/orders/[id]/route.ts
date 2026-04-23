import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import orderModel from "@/domains/order/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
  const adminEmail = await getAdminSessionEmail(request.headers);
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
