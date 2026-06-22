import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import articleAdminModel from "@/domains/article/model/admin";
import { ArticleSchema } from "@/domains/article/model/schema";
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

export const POST = async (request: NextRequest) => {
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

  const payload = await request.json().catch(() => null);
  const parsed = ArticleSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const item = await articleAdminModel.createDraft(parsed.data);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "create_failed" },
      { status: 500 }
    );
  }
};
