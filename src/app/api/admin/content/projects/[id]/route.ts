import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import projectAdminModel from "@/domains/project/model/admin";
import { ProjectSchema } from "@/domains/project/model/schema";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import { isStaticContentMode } from "@/lib/content-mode";

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

  if (isStaticContentMode()) {
    return NextResponse.json(
      { ok: false, error: "read_only" },
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

  const payload = await request.json().catch(() => null);
  const parsed = ProjectSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const item = await projectAdminModel.updateById(id, parsed.data);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message.includes("not found")) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "update_failed" },
      { status: 500 }
    );
  }
};
