import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import projectModel from "@/domains/project/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

const ReorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

export const PUT = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = ReorderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const items = await projectModel.reorderByIds(parsed.data.ids);
    return NextResponse.json({ ok: true, items });
  } catch {
    return NextResponse.json(
      { ok: false, error: "reorder_failed" },
      { status: 400 }
    );
  }
};
