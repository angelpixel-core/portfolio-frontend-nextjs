import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { db } from "@/db";
import { activity } from "@/db/schema";
import { ResumeRequestSchema } from "@/services/resumeRequest/schema";
import { sendResumeRequestEmail } from "@/services/contact/postmark";

const ACTIVITY_TYPE = "request_resume";
const ACTIVITY_EVENT = "resume_request";
const REQUESTED_STATUS = "requested";
const SENT_STATUS = "sent";

const getSessionUser = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
};

const getLatestStatus = async (userId: string) => {
  const rows = await db
    .select({ status: activity.status })
    .from(activity)
    .where(and(eq(activity.userId, userId), eq(activity.type, ACTIVITY_TYPE)))
    .orderBy(desc(activity.createdAt))
    .limit(1);

  return rows[0]?.status ?? null;
};

export const GET = async (request: NextRequest) => {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "unauthenticated" },
        { status: 401 }
      );
    }

    const status = await getLatestStatus(user.id);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    logger.error("ResumeRequest", "Failed to fetch status", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "unauthenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = ResumeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: activity.id })
      .from(activity)
      .where(
        and(
          eq(activity.userId, user.id),
          eq(activity.type, ACTIVITY_TYPE),
          eq(activity.status, REQUESTED_STATUS)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "already_requested" },
        { status: 409 }
      );
    }

    const activityId = randomUUID();
    const now = new Date();
    await db.insert(activity).values({
      id: activityId,
      userId: user.id,
      type: ACTIVITY_TYPE,
      status: REQUESTED_STATUS,
      event: ACTIVITY_EVENT,
      source: parsed.data.source,
      createdAt: now,
      updatedAt: now,
    });

    const delivery = await sendResumeRequestEmail(
      { id: user.id, email: user.email, name: user.name ?? undefined },
      parsed.data
    );

    if (!delivery.ok) {
      return NextResponse.json(
        { ok: false, error: "provider_error" },
        { status: 502 }
      );
    }

    await db
      .update(activity)
      .set({ status: SENT_STATUS, updatedAt: new Date() })
      .where(eq(activity.id, activityId));

    return NextResponse.json({ ok: true, status: SENT_STATUS });
  } catch (error) {
    logger.error("ResumeRequest", "Failed to process request", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
