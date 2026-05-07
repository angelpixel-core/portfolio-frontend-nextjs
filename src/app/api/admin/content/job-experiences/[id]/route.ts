import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import jobExperienceModel, {
  JobExperienceSchema,
} from "@/domains/job-experience/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

type Params = { params: Promise<{ id: string }> };

export const PUT = async (request: NextRequest, { params }: Params) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

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

  const payload = await request.json().catch(() => null);
  const parsed = JobExperienceSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const item = await jobExperienceModel.updateById(id, parsed.data);
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
