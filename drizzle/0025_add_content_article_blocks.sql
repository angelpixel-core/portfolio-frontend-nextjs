CREATE TABLE IF NOT EXISTS "content_article_block" (
  "id" text PRIMARY KEY NOT NULL,
  "article_id" integer NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "block_type" text NOT NULL,
  "title" text,
  "body" text,
  "image_asset_id" text,
  "image_ref" text,
  "image_alt" text,
  "image_position" text,
  "caption" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "content_article_block_block_type_check" CHECK ("block_type" IN ('text', 'image', 'quote', 'callout', 'code', 'divider')),
  CONSTRAINT "content_article_block_image_position_check" CHECK ("image_position" IS NULL OR "image_position" IN ('top', 'left', 'right', 'bottom'))
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'content_article_block_article_id_content_article_id_fk'
  ) THEN
    ALTER TABLE "content_article_block"
      ADD CONSTRAINT "content_article_block_article_id_content_article_id_fk"
      FOREIGN KEY ("article_id")
      REFERENCES "content_article"("id")
      ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'content_article_block_image_asset_id_content_asset_id_fk'
  ) THEN
    ALTER TABLE "content_article_block"
      ADD CONSTRAINT "content_article_block_image_asset_id_content_asset_id_fk"
      FOREIGN KEY ("image_asset_id")
      REFERENCES "content_asset"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "content_article_block_article_id_idx" ON "content_article_block" ("article_id");
CREATE INDEX IF NOT EXISTS "content_article_block_sort_order_idx" ON "content_article_block" ("sort_order");
CREATE INDEX IF NOT EXISTS "content_article_block_image_asset_id_idx" ON "content_article_block" ("image_asset_id");
CREATE UNIQUE INDEX IF NOT EXISTS "content_article_block_article_id_sort_order_unique" ON "content_article_block" ("article_id", "sort_order");

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "content_article_block" TO developer;
