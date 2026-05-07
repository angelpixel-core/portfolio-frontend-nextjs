INSERT INTO "content_word_cloud_concept" (
  "id",
  "label",
  "weight",
  "description",
  "related_keywords",
  "technologies",
  "companies"
) VALUES
  (
    'distributed-systems',
    'Distributed Systems',
    5,
    'Designing and operating reliable distributed systems with consistency, fault tolerance, and observability.',
    '["event-driven","consistency","resilience"]'::jsonb,
    '[{"name":"Kafka","icon":"Kafka"},{"name":"PostgreSQL","icon":"Postgres"},{"name":"Redis","icon":"Redis"}]'::jsonb,
    '["Google","SchoolStatus"]'::jsonb
  ),
  (
    'backend-engineering',
    'Backend Engineering',
    4,
    'Building robust backend services and APIs with strong contracts and operational visibility.',
    '["api design","domain modeling","observability"]'::jsonb,
    '[{"name":"Ruby","icon":"Ruby"},{"name":"Rails","icon":"Rails"},{"name":"TypeScript","icon":"TypeScript"}]'::jsonb,
    '["ThinkCERCA","Bitex"]'::jsonb
  )
ON CONFLICT ("id") DO UPDATE SET
  "label" = EXCLUDED."label",
  "weight" = EXCLUDED."weight",
  "description" = EXCLUDED."description",
  "related_keywords" = EXCLUDED."related_keywords",
  "technologies" = EXCLUDED."technologies",
  "companies" = EXCLUDED."companies",
  "updated_at" = now();
