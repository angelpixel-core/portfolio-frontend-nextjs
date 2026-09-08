import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import projectAdminModel from "@/domains/project/model/admin";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import { isStaticContentMode } from "@/lib/content-mode";

const ReorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

export const PUT = async (request: NextRequest) => {
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

  const payload = await request.json().catch(() => null);
  const parsed = ReorderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const items = await projectAdminModel.reorderByIds(parsed.data.ids);
    return NextResponse.json({ ok: true, items });
  } catch {
    return NextResponse.json(
      { ok: false, error: "reorder_failed" },
      { status: 400 }
    );
  }
};
