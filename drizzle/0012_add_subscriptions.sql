CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'pending_confirmation' NOT NULL,
	"source" text,
	"article_slug" text,
	"locale" text,
	"confirmed_at" timestamp,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "subscription_event" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"type" text NOT NULL,
	"payload" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_event_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE cascade
);

CREATE UNIQUE INDEX "subscriptions_email_unique" ON "subscriptions" ("email");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" ("status");
CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" ("created_at");
CREATE INDEX "subscription_event_subscription_id_idx" ON "subscription_event" ("subscription_id");
CREATE INDEX "subscription_event_type_idx" ON "subscription_event" ("type");
