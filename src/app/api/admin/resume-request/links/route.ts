import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import resumeRequestLinkModel from "@/domains/resume-request-link/model";
import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import {
  createResumeRequestToken,
  getResumeRequestLinkState,
  getResumeRequestPublicBaseUrl,
  hashResumeRequestToken,
} from "@/services/resumeRequest/publicLink";
import {
  AdminCreateResumeRequestLinkSchema,
  normalizeTtlDays,
} from "@/services/resumeRequest/publicLinkSchema";

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

  const now = new Date();
  const items = await resumeRequestLinkModel.list();

  return NextResponse.json({
    ok: true,
    items: items.map((item) => ({
      ...item,
      state: getResumeRequestLinkState(item, now),
    })),
  });
};

export const POST = async (request: NextRequest) => {
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

  const payload = await request.json().catch(() => null);
  const parsed = AdminCreateResumeRequestLinkSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const ttlDays = normalizeTtlDays(parsed.data.ttlDays);
  const token = createResumeRequestToken();
  const tokenHash = hashResumeRequestToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

  const item = await resumeRequestLinkModel.create({
    id: randomUUID(),
    tokenHash,
    recipientName: parsed.data.recipientName,
    ttlDays,
    expiresAt,
    createdByAdminEmail: adminEmail,
  });

  const publicUrl = new URL(
    `/resume-request/${token}`,
    getResumeRequestPublicBaseUrl()
  ).toString();

  return NextResponse.json({
    ok: true,
    item: {
      ...item,
      state: getResumeRequestLinkState(item, now),
    },
    publicUrl,
  });
};
