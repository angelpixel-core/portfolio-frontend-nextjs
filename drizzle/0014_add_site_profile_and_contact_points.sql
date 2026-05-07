CREATE TABLE IF NOT EXISTS "site_profile" (
  "id" integer PRIMARY KEY NOT NULL,
  "nickname" text NOT NULL,
  "author_name" text NOT NULL,
  "author_role" text NOT NULL,
  "biography" text[] NOT NULL DEFAULT '{}'::text[],
  "avatar" text NOT NULL,
  "logo" text,
  "location" text NOT NULL,
  "email" text NOT NULL,
  "resume" text,
  "hero_link" text,
  "hire_me_link" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "site_contact_point" (
  "id" integer PRIMARY KEY NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "label" text NOT NULL,
  "icon" text NOT NULL,
  "identifier" text NOT NULL,
  "href" text NOT NULL,
  "value" text NOT NULL,
  "visible" boolean NOT NULL DEFAULT true,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "site_contact_point_type_check" CHECK ("type" IN ('communication', 'social', 'messaging')),
  CONSTRAINT "site_contact_point_provider_check" CHECK ("provider" IN ('email', 'linkedin', 'github', 'whatsapp', 'twitter', 'dribbble', 'telegram', 'calendly'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "site_contact_point_provider_unique" ON "site_contact_point" ("provider");
CREATE INDEX IF NOT EXISTS "site_contact_point_visible_idx" ON "site_contact_point" ("visible");
CREATE INDEX IF NOT EXISTS "site_contact_point_sort_order_idx" ON "site_contact_point" ("sort_order");

INSERT INTO "site_profile" (
  "id",
  "nickname",
  "author_name",
  "author_role",
  "biography",
  "avatar",
  "logo",
  "location",
  "email",
  "resume",
  "hero_link",
  "hire_me_link"
) VALUES (
  1,
  'portfolio-owner',
  'Angel Szymczak',
  'Software Engineer',
  ARRAY[
    'Hi, I''m a Full Stack Developer passionate about creating user-centric digital experiences.',
    'With expertise in modern web technologies, I build scalable applications that solve real-world problems.',
    'I''m constantly learning and adapting to new technologies to deliver the best solutions.'
  ],
  '/images/profile/hero.png',
  '/images/logo.svg',
  'Remote',
  'contact@angelpixel.io',
  '#',
  'https://linkedin.com/in/angelszymczak',
  'https://t.me/angelszymczak'
)
ON CONFLICT ("id") DO UPDATE
SET
  "nickname" = EXCLUDED."nickname",
  "author_name" = EXCLUDED."author_name",
  "author_role" = EXCLUDED."author_role",
  "biography" = EXCLUDED."biography",
  "avatar" = EXCLUDED."avatar",
  "logo" = EXCLUDED."logo",
  "location" = EXCLUDED."location",
  "email" = EXCLUDED."email",
  "resume" = EXCLUDED."resume",
  "hero_link" = EXCLUDED."hero_link",
  "hire_me_link" = EXCLUDED."hire_me_link",
  "updated_at" = now();

INSERT INTO "site_contact_point" (
  "id",
  "type",
  "provider",
  "label",
  "icon",
  "identifier",
  "href",
  "value",
  "visible",
  "sort_order"
) VALUES
  (1, 'communication', 'email', 'Email', 'Mail', 'contact@angelpixel.io', 'mailto:contact@angelpixel.io', 'contact@angelpixel.io', true, 1),
  (2, 'social', 'linkedin', 'LinkedIn', 'LinkedIn', 'angelszymczak', 'https://linkedin.com/in/angelszymczak', 'https://linkedin.com/in/angelszymczak', true, 2),
  (3, 'social', 'github', 'GitHub', 'GitHub', 'angelpixel-core', 'https://github.com/angelpixel-core', 'https://github.com/angelpixel-core', true, 3),
  (4, 'communication', 'whatsapp', 'WhatsApp', 'WhatsApp', '54912345678', 'https://wa.me/54912345678', 'https://wa.me/54912345678', true, 4),
  (5, 'social', 'twitter', 'Twitter', 'Twitter', 'angelpixelio', 'https://twitter.com/angelpixelio', 'https://twitter.com/angelpixelio', true, 5),
  (6, 'social', 'dribbble', 'Dribbble', 'Dribbble', 'angelpixel', 'https://dribbble.com/angelpixel', 'https://dribbble.com/angelpixel', true, 6),
  (7, 'messaging', 'telegram', 'Telegram', 'Telegram', 'angelszymczak', 'https://t.me/angelszymczak', 'https://t.me/angelszymczak', true, 7),
  (8, 'communication', 'calendly', 'Calendly', 'Calendar', 'angelpixel', 'https://calendly.com/angelpixel', 'https://calendly.com/angelpixel', true, 8)
ON CONFLICT ("provider") DO UPDATE
SET
  "type" = EXCLUDED."type",
  "label" = EXCLUDED."label",
  "icon" = EXCLUDED."icon",
  "identifier" = EXCLUDED."identifier",
  "href" = EXCLUDED."href",
  "value" = EXCLUDED."value",
  "visible" = EXCLUDED."visible",
  "sort_order" = EXCLUDED."sort_order",
  "updated_at" = now();
