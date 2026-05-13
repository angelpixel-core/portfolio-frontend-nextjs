import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import articleAdminModel from "@/domains/article/model/admin";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

export const GET = async (request: NextRequest) => {
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.CONTENT_WRITE
  );

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const items = await articleAdminModel.fetchAllForAdmin();
  return NextResponse.json({ ok: true, items });
};
