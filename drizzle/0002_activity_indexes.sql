CREATE INDEX IF NOT EXISTS "activity_user_type_status_created_at_idx" ON "activity" ("user_id","type","status","created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "activity_user_type_requested_unique" ON "activity" ("user_id","type") WHERE "status" = 'requested';
