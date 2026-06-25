-- Migrate article reading time from formatted text to integer minutes.

UPDATE "content_article"
SET "reading_time" = COALESCE(
  NULLIF(regexp_replace("reading_time", '\\D', '', 'g'), ''),
  '0'
)
WHERE "reading_time" IS NOT NULL;

ALTER TABLE "content_article"
  ALTER COLUMN "reading_time" TYPE integer
  USING COALESCE(
    NULLIF(regexp_replace("reading_time", '\\D', '', 'g'), ''),
    '0'
  )::integer;
