import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import resumeRequestSubmissionModel from "@/domains/resume-request-submission/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

export const GET = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const items = await resumeRequestSubmissionModel.list();
  return NextResponse.json({ ok: true, items });
};
