import "server-only";

import { desc } from "drizzle-orm";

import { db } from "../../../db";
import { resumeRequestSubmissions } from "../../../db/schema";
import {
  ResumeRequestSubmissionSchema,
  ResumeRequestSubmissionsSchema,
  type ResumeRequestSubmission,
} from "./schema";

type CreateSubmissionInput = {
  id: string;
  linkId: string;
  email: string;
  name: string;
  context?: string | null;
  role?: string | null;
  company?: string | null;
  notes?: string | null;
  status?: string;
  origin?: string;
};

const create = async (
  input: CreateSubmissionInput
): Promise<ResumeRequestSubmission> => {
  const now = new Date();

  await db.insert(resumeRequestSubmissions).values({
    ...input,
    status: input.status ?? "requested",
    origin: input.origin ?? "on_demand_link",
    createdAt: now,
    updatedAt: now,
  });

  const [created] = await db
    .select()
    .from(resumeRequestSubmissions)
    .orderBy(desc(resumeRequestSubmissions.createdAt))
    .limit(1);

  return ResumeRequestSubmissionSchema.parse(created);
};

const list = async (limit = 300): Promise<ResumeRequestSubmission[]> => {
  const rows = await db
    .select()
    .from(resumeRequestSubmissions)
    .orderBy(desc(resumeRequestSubmissions.createdAt))
    .limit(limit);

  return ResumeRequestSubmissionsSchema.parse(rows);
};

const resumeRequestSubmissionModel = {
  create,
  list,
};

export default resumeRequestSubmissionModel;
