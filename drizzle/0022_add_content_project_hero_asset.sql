ALTER TABLE "content_project"
  ADD COLUMN IF NOT EXISTS "hero_asset_id" text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'content_project_hero_asset_id_content_asset_id_fk'
  ) THEN
    ALTER TABLE "content_project"
      ADD CONSTRAINT "content_project_hero_asset_id_content_asset_id_fk"
      FOREIGN KEY ("hero_asset_id")
      REFERENCES "content_asset"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "content_project_hero_asset_id_idx" ON "content_project" ("hero_asset_id");
