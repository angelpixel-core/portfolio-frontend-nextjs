CREATE TABLE IF NOT EXISTS "content_article" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "url" text NOT NULL,
  "slug" text NOT NULL,
  "lang" text NOT NULL DEFAULT 'ES',
  "reading_time" text NOT NULL,
  "published_at" text NOT NULL,
  "summary" text NOT NULL,
  "content" text,
  "img" text NOT NULL,
  "img_alt" text,
  "featured" boolean NOT NULL DEFAULT false,
  "visible" boolean NOT NULL DEFAULT true,
  "priority" integer NOT NULL DEFAULT 0,
  "category" text,
  "badges" jsonb,
  "status" text NOT NULL DEFAULT 'published',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "content_article_lang_check" CHECK ("lang" IN ('ES', 'EN')),
  CONSTRAINT "content_article_category_check" CHECK ("category" IN ('React', 'Architecture', 'Performance', 'Testing')),
  CONSTRAINT "content_article_status_check" CHECK ("status" IN ('published', 'draft'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "content_article_slug_unique" ON "content_article" ("slug");
CREATE INDEX IF NOT EXISTS "content_article_visible_idx" ON "content_article" ("visible");
CREATE INDEX IF NOT EXISTS "content_article_published_at_idx" ON "content_article" ("published_at");
