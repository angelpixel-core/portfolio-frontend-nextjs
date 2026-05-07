import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import jobExperienceModel from "@/domains/job-experience/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

export const GET = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const items = await jobExperienceModel.fetchAll({ publish: false });
  return NextResponse.json({ ok: true, items });
};
