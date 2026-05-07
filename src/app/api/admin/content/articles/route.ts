import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import articleAdminModel from "@/domains/article/model/admin";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

export const GET = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const items = await articleAdminModel.fetchAllForAdmin();
  return NextResponse.json({ ok: true, items });
};
