UPDATE "content_article"
SET "img" = '/images/articles/fcs-overview.svg', "updated_at" = now()
WHERE "img" = '/images/articles/fcs-overview.png';

UPDATE "content_article"
SET "img" = '/images/articles/event-pipeline.svg', "updated_at" = now()
WHERE "img" = '/images/articles/event-pipeline.png';

UPDATE "content_asset"
SET "url" = '/images/articles/fcs-overview.svg', "updated_at" = now()
WHERE "url" = '/images/articles/fcs-overview.png';

UPDATE "content_asset"
SET "url" = '/images/articles/event-pipeline.svg', "updated_at" = now()
WHERE "url" = '/images/articles/event-pipeline.png';
