-- Phase 2 backfill: normalize legacy content_article.img into content_asset
-- and attach content_article.hero_asset_id when it is still null.

WITH source_images AS (
  SELECT DISTINCT img
  FROM "content_article"
  WHERE img IS NOT NULL
    AND img <> ''
),
upsert_assets AS (
  INSERT INTO "content_asset" (
    "id",
    "url",
    "provider",
    "provider_key",
    "mime_type",
    "size_bytes",
    "width",
    "height",
    "alt"
  )
  SELECT
    'asset_legacy_' || md5(img) AS "id",
    img AS "url",
    'legacy-url' AS "provider",
    'legacy:article-img:' || md5(img) AS "provider_key",
    CASE
      WHEN lower(img) LIKE '%.avif%' THEN 'image/avif'
      WHEN lower(img) LIKE '%.webp%' THEN 'image/webp'
      WHEN lower(img) LIKE '%.png%' THEN 'image/png'
      WHEN lower(img) LIKE '%.jpeg%' THEN 'image/jpeg'
      WHEN lower(img) LIKE '%.jpg%' THEN 'image/jpeg'
      WHEN lower(img) LIKE '%.gif%' THEN 'image/gif'
      WHEN lower(img) LIKE '%.svg%' THEN 'image/svg+xml'
      ELSE 'application/octet-stream'
    END AS "mime_type",
    NULL::bigint AS "size_bytes",
    NULL::integer AS "width",
    NULL::integer AS "height",
    NULL::text AS "alt"
  FROM source_images
  ON CONFLICT ("provider_key") DO NOTHING
  RETURNING "id"
)
UPDATE "content_article" AS article
SET
  "hero_asset_id" = asset."id",
  "updated_at" = now()
FROM "content_asset" AS asset
WHERE article."hero_asset_id" IS NULL
  AND article."img" IS NOT NULL
  AND article."img" <> ''
  AND asset."provider_key" = 'legacy:article-img:' || md5(article."img");
