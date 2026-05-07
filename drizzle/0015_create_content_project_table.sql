CREATE TABLE IF NOT EXISTS "content_project" (
  "id" integer PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "description" text NOT NULL,
  "technologies" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "outcomes" text,
  "technical_highlights" jsonb,
  "sections" jsonb,
  "demo" text,
  "repository" text,
  "img" text NOT NULL,
  "screenshots" jsonb,
  "tags" text NOT NULL,
  "featured" boolean NOT NULL DEFAULT false,
  "visible" boolean NOT NULL DEFAULT true,
  "priority" integer NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'planned',
  "featured_card" jsonb,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "content_project_status_check" CHECK ("status" IN ('planned', 'in-progress', 'live', 'shipped'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "content_project_slug_unique" ON "content_project" ("slug");
CREATE INDEX IF NOT EXISTS "content_project_visible_idx" ON "content_project" ("visible");
CREATE INDEX IF NOT EXISTS "content_project_priority_idx" ON "content_project" ("priority");
