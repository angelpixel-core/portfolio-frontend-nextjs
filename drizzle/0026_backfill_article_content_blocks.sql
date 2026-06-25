-- Phase 4 backfill: migrate legacy content_article.content into a single
-- text block per article so the public reader can render blocks first.

WITH legacy_articles AS (
  SELECT id, content
  FROM "content_article" AS article
  WHERE article.content IS NOT NULL
    AND article.content <> ''
    AND NOT EXISTS (
      SELECT 1
      FROM "content_article_block" block
      WHERE block."article_id" = article.id
    )
)
INSERT INTO "content_article_block" (
  "id",
  "article_id",
  "sort_order",
  "block_type",
  "title",
  "body"
)
SELECT
  'block_legacy_article_' || article.id || '_content' AS "id",
  article.id AS "article_id",
  0 AS "sort_order",
  'text' AS "block_type",
  NULL::text AS "title",
  article.content AS "body"
FROM legacy_articles AS article
ON CONFLICT ("id") DO NOTHING;
