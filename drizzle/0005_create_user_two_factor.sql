CREATE TABLE "user_two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"secret" text,
	"backup_codes" text,
	"secret_encrypted" text,
	"pending_secret_encrypted" text,
	"recovery_codes_hash" text,
	"enabled" boolean DEFAULT false NOT NULL,
	"enabled_at" timestamp,
	"last_verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
