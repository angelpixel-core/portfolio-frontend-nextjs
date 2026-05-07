CREATE TABLE IF NOT EXISTS "resume_request_link" (
  "id" text PRIMARY KEY NOT NULL,
  "token_hash" text NOT NULL,
  "recipient_name" text NOT NULL,
  "ttl_days" integer NOT NULL DEFAULT 7,
  "expires_at" timestamp NOT NULL,
  "used_at" timestamp,
  "revoked_at" timestamp,
  "created_by_admin_email" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "resume_request_link_token_hash_unique" ON "resume_request_link" ("token_hash");
CREATE INDEX IF NOT EXISTS "resume_request_link_expires_at_idx" ON "resume_request_link" ("expires_at");
CREATE INDEX IF NOT EXISTS "resume_request_link_used_at_idx" ON "resume_request_link" ("used_at");
CREATE INDEX IF NOT EXISTS "resume_request_link_revoked_at_idx" ON "resume_request_link" ("revoked_at");
