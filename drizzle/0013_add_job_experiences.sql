CREATE TABLE IF NOT EXISTS "job_experience" (
  "id" integer PRIMARY KEY NOT NULL,
  "publish" boolean NOT NULL DEFAULT true,
  "position" text NOT NULL,
  "company" text NOT NULL,
  "company_link" text NOT NULL,
  "time" text NOT NULL,
  "year" text NOT NULL,
  "address" text NOT NULL DEFAULT '',
  "context_badges" text[] NOT NULL DEFAULT '{}'::text[],
  "technologies" text[] NOT NULL DEFAULT '{}'::text[],
  "group" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "job_experience_group_check" CHECK ("group" IN ('engineering', 'platform'))
);

CREATE TABLE IF NOT EXISTS "job_experience_task" (
  "id" text PRIMARY KEY NOT NULL,
  "job_experience_id" integer NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "description" text NOT NULL,
  "tags" text[],
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "job_experience_task_job_experience_id_fkey"
    FOREIGN KEY ("job_experience_id")
    REFERENCES "job_experience"("id")
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "job_experience_group_idx" ON "job_experience" ("group");
CREATE INDEX IF NOT EXISTS "job_experience_publish_idx" ON "job_experience" ("publish");
CREATE INDEX IF NOT EXISTS "job_experience_task_job_experience_id_idx" ON "job_experience_task" ("job_experience_id");
CREATE INDEX IF NOT EXISTS "job_experience_task_sort_order_idx" ON "job_experience_task" ("sort_order");

INSERT INTO "job_experience" (
  "id", "publish", "position", "company", "company_link", "time", "year", "address", "context_badges", "technologies", "group"
) VALUES
  (1, true, 'Software Engineer', 'Google', 'https://www.google.com', '2024', '2024', '', ARRAY['Enterprise','Internal Platform'], ARRAY['Angular','Dart','Python','Mutation Testing','Piper Monorepo','GCP'], 'engineering'),
  (2, true, 'Software Engineer', 'SchoolStatus', 'https://www.schoolstatus.com', '2023', '2023', '', ARRAY['Event-Driven','Realtime Messaging'], ARRAY['Ruby','Rails','Kafka','Redis','PostgreSQL','AWS','Twilio'], 'engineering'),
  (3, true, 'Senior Software Engineer', 'ThinkCERCA', 'https://www.thinkcerca.com', '2023', '2023', '', ARRAY['EdTech Platform'], ARRAY['Ruby','Rails','React','Redis','PostgreSQL','GraphQL','Sidekiq'], 'engineering'),
  (4, true, 'Software Engineer', 'SouthWorks', 'https://www.southworks.com', '2020 - 2021', '2021', '', ARRAY['Enterprise Consulting','Cloud Engineering'], ARRAY['.NET','C#','Flutter','TypeScript','IaC','Pulumi','CI/CD','IA','Azure'], 'engineering'),
  (5, true, 'Software Engineer', 'Nubi', 'https://www.tunubi.com', '2019 - 2020', '2020', '', ARRAY['Payments Infrastructure','ETL','Fintech'], ARRAY['Ruby','Rails','React','JavaScript','Node','PostgreSQL','Redis','AWS'], 'engineering'),
  (6, true, 'Software Engineer', 'Bitex', 'https://bitex.la', '2017 - 2019', '2019', '', ARRAY['Crypto Exchange','Fintech'], ARRAY['Ruby','Rails','Rspec','Redis','Docker','AWS','Crypto Payments','Blockchain'], 'engineering'),
  (7, true, 'Software Engineer', 'SeSocio', 'https://sesocio.com', '2017', '2017', '', ARRAY['Crypto Exchange','Payment Infrastructure'], ARRAY['Ruby','Rails','PostgreSQL','Sidekiq','Heroku'], 'engineering'),
  (8, false, 'Selected Platform Project', 'Zipline', 'https://www.flyzipline.com', 'Selected project', 'Selected', '', ARRAY['Aerospace','Drone Delivery','IoT'], ARRAY['Ruby','Event Pipelines','AWS'], 'platform'),
  (9, true, 'Selected Platform Project', 'Spin (Ford)', 'https://www.spin.app', 'Selected project', 'Selected', '', ARRAY['Mobility','IoT Fleet Systems'], ARRAY['Ruby','React','Node.js','AWS'], 'platform')
ON CONFLICT ("id") DO UPDATE
SET
  "publish" = EXCLUDED."publish",
  "position" = EXCLUDED."position",
  "company" = EXCLUDED."company",
  "company_link" = EXCLUDED."company_link",
  "time" = EXCLUDED."time",
  "year" = EXCLUDED."year",
  "address" = EXCLUDED."address",
  "context_badges" = EXCLUDED."context_badges",
  "technologies" = EXCLUDED."technologies",
  "group" = EXCLUDED."group",
  "updated_at" = now();

INSERT INTO "job_experience_task" ("id", "job_experience_id", "sort_order", "description", "tags") VALUES
  ('jobexp-1-task-1', 1, 1, 'Designed operational UI flows and tooling for Google Classroom operations, integrating internal APIs and improving validation pipelines.', NULL),
  ('jobexp-2-task-1', 2, 1, 'Built asynchronous messaging pipelines integrating Twilio and Bandwidth with webhook ingestion and Kafka-based event processing handling thousands of daily notifications.', NULL),
  ('jobexp-3-task-1', 3, 1, 'Developed full-stack features for a learning platform used across US school districts, improving backend performance, Google Classroom integrations and frontend UX.', NULL),
  ('jobexp-4-task-1', 4, 1, 'Worked in distributed teams supporting enterprise clients including Microsoft-related projects and global engineering workflows.', NULL),
  ('jobexp-5-task-1', 5, 1, 'Developed backend services supporting PayPal integrations and transaction processing in a regulated financial environment.', NULL),
  ('jobexp-6-task-1', 6, 1, 'Worked on backend systems supporting cryptocurrency payments and exchange infrastructure in a high-risk fintech environment later acquired by HTX.', NULL),
  ('jobexp-7-task-1', 7, 1, 'Fullstack improvements and refactoring in an investment crowdfunding platform later acquired by Blockchain.com.', NULL),
  ('jobexp-8-task-1', 8, 1, 'Real-time telemetry ingestion pipelines for autonomous drone logistics.', NULL),
  ('jobexp-9-task-1', 9, 1, 'Operational dashboards and real-time data integrations for electric scooter fleet management systems.', NULL)
ON CONFLICT ("id") DO UPDATE
SET
  "job_experience_id" = EXCLUDED."job_experience_id",
  "sort_order" = EXCLUDED."sort_order",
  "description" = EXCLUDED."description",
  "tags" = EXCLUDED."tags",
  "updated_at" = now();
