import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import jobExperienceModel from "@/domains/job-experience/model";
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

  const items = await jobExperienceModel.fetchAll({ publish: false });
  return NextResponse.json({ ok: true, items });
};
