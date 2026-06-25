import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import articleAdminModel from "@/domains/article/model/admin";
import { ArticleBlocksSchema } from "@/domains/article/model/schema";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

type Params = { params: Promise<{ id: string }> };

export const PUT = async (request: NextRequest, { params }: Params) => {
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

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { ok: false, error: "invalid_id" },
      { status: 400 }
    );
  }

  const article = await articleAdminModel.fetchById(id);
  if (!article) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = ArticleBlocksSchema.safeParse(payload?.blocks);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const item = await articleAdminModel.updateById(id, {
      ...article,
      blocks: parsed.data,
    });

    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json(
      { ok: false, error: "update_failed" },
      { status: 500 }
    );
  }
};
