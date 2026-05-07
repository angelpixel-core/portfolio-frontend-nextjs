CREATE TABLE IF NOT EXISTS "resume_request_submission" (
  "id" text PRIMARY KEY NOT NULL,
  "link_id" text NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "context" text,
  "role" text,
  "company" text,
  "notes" text,
  "status" text NOT NULL DEFAULT 'requested',
  "origin" text NOT NULL DEFAULT 'on_demand_link',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "resume_request_submission_link_id_fkey"
    FOREIGN KEY ("link_id")
    REFERENCES "resume_request_link"("id")
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "resume_request_submission_email_idx" ON "resume_request_submission" ("email");
CREATE INDEX IF NOT EXISTS "resume_request_submission_status_idx" ON "resume_request_submission" ("status");
CREATE INDEX IF NOT EXISTS "resume_request_submission_created_at_idx" ON "resume_request_submission" ("created_at");
