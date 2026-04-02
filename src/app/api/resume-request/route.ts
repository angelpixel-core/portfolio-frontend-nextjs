import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "../../../db";
import { activity } from "../../../db/schema";

type ResumeRequestSource = "resume_cta" | "resume_intent";

const ACTIVITY_TYPE = "request_resume";
const ACTIVITY_EVENT = "resume_request";

const getUserId = (session: unknown): string | null => {
  if (!session || typeof session !== "object") return null;
  const sessionRecord = session as {
    user?: { id?: string };
    session?: { userId?: string };
  };
  return sessionRecord.user?.id ?? sessionRecord.session?.userId ?? null;
};

const getLatestStatus = async (userId: string) => {
  const [latest] = await db
    .select({ status: activity.status })
    .from(activity)
    .where(and(eq(activity.userId, userId), eq(activity.type, ACTIVITY_TYPE)))
    .orderBy(desc(activity.createdAt))
    .limit(1);
  return latest?.status ?? null;
};

const isValidSource = (value: unknown): value is ResumeRequestSource =>
  value === "resume_cta" || value === "resume_intent";

const getSession = async (request: NextRequest) => {
  try {
    return await auth.api.getSession({ headers: request.headers });
  } catch {
    return null;
  }
};

export const GET = async (request: NextRequest) => {
  const session = await getSession(request);
  const userId = getUserId(session);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "unauthenticated" },
      { status: 401 }
    );
  }

  const status = await getLatestStatus(userId);
  return NextResponse.json({ ok: true, status });
};

export const POST = async (request: NextRequest) => {
  const session = await getSession(request);
  const userId = getUserId(session);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "unauthenticated" },
      { status: 401 }
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    source?: ResumeRequestSource;
  } | null;

  if (!payload || !isValidSource(payload.source)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const existingStatus = await getLatestStatus(userId);
  if (existingStatus === "requested" || existingStatus === "sent") {
    return NextResponse.json(
      { ok: false, error: "already_requested", status: existingStatus },
      { status: 409 }
    );
  }

  const now = new Date();
  const id = crypto.randomUUID();

  await db.insert(activity).values({
    id,
    userId,
    type: ACTIVITY_TYPE,
    status: "requested",
    event: ACTIVITY_EVENT,
    source: payload.source,
    createdAt: now,
    updatedAt: now,
  });

  await db
    .update(activity)
    .set({ status: "sent", updatedAt: new Date() })
    .where(eq(activity.id, id));

  return NextResponse.json({ ok: true, status: "sent" });
};
