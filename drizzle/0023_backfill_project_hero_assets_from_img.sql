WITH source_images AS (
  SELECT DISTINCT img
  FROM "content_project"
  WHERE img IS NOT NULL
    AND img <> ''
)
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
  'legacy:project-img:' || md5(img) AS "provider_key",
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
ON CONFLICT ("provider_key") DO NOTHING;

UPDATE "content_project" AS project
SET
  "hero_asset_id" = asset."id",
  "updated_at" = now()
FROM "content_asset" AS asset
WHERE project."hero_asset_id" IS NULL
  AND project."img" IS NOT NULL
  AND project."img" <> ''
  AND asset."provider_key" = 'legacy:project-img:' || md5(project."img");
