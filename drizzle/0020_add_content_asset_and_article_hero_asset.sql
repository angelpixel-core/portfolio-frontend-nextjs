CREATE TABLE IF NOT EXISTS "content_asset" (
  "id" text PRIMARY KEY NOT NULL,
  "url" text NOT NULL,
  "provider" text NOT NULL,
  "provider_key" text NOT NULL,
  "mime_type" text NOT NULL,
  "size_bytes" bigint,
  "width" integer,
  "height" integer,
  "alt" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "content_asset_provider_key_unique" ON "content_asset" ("provider_key");
CREATE INDEX IF NOT EXISTS "content_asset_provider_idx" ON "content_asset" ("provider");

ALTER TABLE "content_article"
  ADD COLUMN IF NOT EXISTS "hero_asset_id" text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'content_article_hero_asset_id_content_asset_id_fk'
  ) THEN
    ALTER TABLE "content_article"
      ADD CONSTRAINT "content_article_hero_asset_id_content_asset_id_fk"
      FOREIGN KEY ("hero_asset_id")
      REFERENCES "content_asset"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "content_article_hero_asset_id_idx" ON "content_article" ("hero_asset_id");
