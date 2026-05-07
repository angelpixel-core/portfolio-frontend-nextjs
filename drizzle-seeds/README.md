# Content Admin SQL Seeds

This directory stores idempotent SQL seed files for content admin tables.

Execution order is numeric:

1. `0001_seed_content_project.sql`
2. `0002_seed_content_article.sql`
3. `0003_seed_content_word_cloud_concept.sql`

## How to run

1. Apply schema migrations first:

```bash
npm run db:migrate
```

2. Apply content seeds:

```bash
npm run db:seed:content-admin
```

The seed files use `ON CONFLICT ... DO UPDATE`, so they are safe to re-run.
