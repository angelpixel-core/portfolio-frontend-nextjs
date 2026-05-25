import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import resumeRequestLinkModel from "@/domains/resume-request-link/model";
import { PERMISSIONS } from "@/application/authz";
import { getResumeRequestLinkState } from "@/application/resumeRequest";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

type Params = { params: Promise<{ id: string }> };

export const POST = async (request: NextRequest, { params }: Params) => {
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

  const { id } = await params;
  const existing = await resumeRequestLinkModel.findById(id);

  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  if (!existing.revokedAt) {
    await resumeRequestLinkModel.revoke(id);
  }

  const updated = await resumeRequestLinkModel.findById(id);

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    item: {
      ...updated,
      state: getResumeRequestLinkState(updated),
    },
  });
};
