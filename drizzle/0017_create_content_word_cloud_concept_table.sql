CREATE TABLE IF NOT EXISTS "content_word_cloud_concept" (
  "id" text PRIMARY KEY NOT NULL,
  "label" text NOT NULL,
  "weight" integer NOT NULL DEFAULT 1,
  "description" text NOT NULL,
  "related_keywords" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "technologies" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "companies" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "content_word_cloud_concept_weight_check" CHECK ("weight" BETWEEN 1 AND 5)
);

CREATE INDEX IF NOT EXISTS "content_word_cloud_concept_weight_idx" ON "content_word_cloud_concept" ("weight");
