CREATE TABLE "activity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"event" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
);

CREATE INDEX "activity_user_type_status_created_idx" ON "activity" ("user_id", "type", "status", "created_at");

CREATE UNIQUE INDEX "activity_request_resume_requested_idx" ON "activity" ("user_id", "type")
WHERE "status" = 'requested';
