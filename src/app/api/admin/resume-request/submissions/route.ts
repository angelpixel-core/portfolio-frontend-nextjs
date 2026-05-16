import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import resumeRequestSubmissionModel from "@/domains/resume-request-submission/model";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

export const GET = async (request: NextRequest) => {
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.RESUME_REQUESTS_MANAGE
  );

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const items = await resumeRequestSubmissionModel.list();
  return NextResponse.json({ ok: true, items });
};
