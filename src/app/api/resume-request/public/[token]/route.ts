import { randomUUID } from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "../../../../../db";
import {
  resumeRequestLinks,
  resumeRequestSubmissions,
} from "../../../../../db/schema";
import resumeRequestLinkModel from "@/domains/resume-request-link/model";
import {
  getResumeRequestLinkState,
  hashResumeRequestToken,
  PublicResumeRequestSubmissionSchema,
} from "@/application/resumeRequest";

type Params = { params: Promise<{ token: string }> };

const mapStateToError = (
  state: "active" | "used" | "revoked" | "expired"
): string => {
  if (state === "used") return "token_used";
  if (state === "revoked") return "token_revoked";
  if (state === "expired") return "token_expired";
  return "token_invalid";
};

export const GET = async (_request: Request, { params }: Params) => {
  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "token_invalid" },
      { status: 400 }
    );
  }

  const tokenHash = hashResumeRequestToken(token);
  const link = await resumeRequestLinkModel.findByTokenHash(tokenHash);

  if (!link) {
    return NextResponse.json(
      { ok: false, error: "token_invalid" },
      { status: 404 }
    );
  }

  const state = getResumeRequestLinkState(link);
  if (state !== "active") {
    return NextResponse.json(
      { ok: false, error: mapStateToError(state) },
      { status: 410 }
    );
  }

  return NextResponse.json({
    ok: true,
    recipientName: link.recipientName,
    expiresAt: link.expiresAt,
  });
};

export const POST = async (request: Request, { params }: Params) => {
  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "token_invalid" },
      { status: 400 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = PublicResumeRequestSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const tokenHash = hashResumeRequestToken(token);
  const now = new Date();

  try {
    const result = await db.transaction(async (tx) => {
      const consumed = await tx
        .update(resumeRequestLinks)
        .set({ usedAt: now, updatedAt: now })
        .where(
          and(
            eq(resumeRequestLinks.tokenHash, tokenHash),
            isNull(resumeRequestLinks.usedAt),
            isNull(resumeRequestLinks.revokedAt),
            gt(resumeRequestLinks.expiresAt, now)
          )
        )
        .returning();

      if (!consumed[0]) {
        return { ok: false as const };
      }

      const link = consumed[0];
      const [submission] = await tx
        .insert(resumeRequestSubmissions)
        .values({
          id: randomUUID(),
          linkId: link.id,
          email: parsed.data.email,
          name: link.recipientName,
          context: parsed.data.context ?? null,
          role: parsed.data.role ?? null,
          company: parsed.data.company ?? null,
          notes: parsed.data.notes ?? null,
          status: "requested",
          origin: "on_demand_link",
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return { ok: true as const, submission };
    });

    if (!result.ok) {
      const link = await resumeRequestLinkModel.findByTokenHash(tokenHash);
      if (!link) {
        return NextResponse.json(
          { ok: false, error: "token_invalid" },
          { status: 404 }
        );
      }

      const state = getResumeRequestLinkState(link);
      return NextResponse.json(
        { ok: false, error: mapStateToError(state) },
        { status: 410 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: result.submission,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
