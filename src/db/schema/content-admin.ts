import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

export const contentAssets = pgTable(
  "content_asset",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    provider: text("provider").notNull(),
    providerKey: text("provider_key").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }),
    width: integer("width"),
    height: integer("height"),
    alt: text("alt"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    providerKeyUnique: uniqueIndex("content_asset_provider_key_unique").on(
      table.providerKey
    ),
    providerIdx: index("content_asset_provider_idx").on(table.provider),
  })
);

export const contentProjects = pgTable(
  "content_project",
  {
    id: integer("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
    outcomes: text("outcomes"),
    technicalHighlights: jsonb("technical_highlights")
      .$type<string[] | null>()
      .default(null),
    sections: jsonb("sections").$type<unknown[] | null>().default(null),
    demo: text("demo"),
    repository: text("repository"),
    img: text("img").notNull(),
    heroAssetId: text("hero_asset_id").references(() => contentAssets.id, {
      onDelete: "set null",
    }),
    screenshots: jsonb("screenshots").$type<string[] | null>().default(null),
    tags: text("tags").notNull(),
    featured: boolean("featured").notNull().default(false),
    visible: boolean("visible").notNull().default(true),
    priority: integer("priority").notNull().default(0),
    status: text("status", {
      enum: ["planned", "in-progress", "live", "shipped"],
    })
      .notNull()
      .default("planned"),
    featuredCard: jsonb("featured_card").$type<Record<
      string,
      unknown
    > | null>(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("content_project_slug_unique").on(table.slug),
    visibleIdx: index("content_project_visible_idx").on(table.visible),
    heroAssetIdx: index("content_project_hero_asset_id_idx").on(
      table.heroAssetId
    ),
    priorityIdx: index("content_project_priority_idx").on(table.priority),
  })
);

export const contentArticles = pgTable(
  "content_article",
  {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    slug: text("slug").notNull(),
    lang: text("lang", { enum: ["ES", "EN"] })
      .notNull()
      .default("ES"),
    readingTime: text("reading_time").notNull(),
    publishedAt: text("published_at").notNull(),
    summary: text("summary").notNull(),
    content: text("content"),
    img: text("img").notNull(),
    imgAlt: text("img_alt"),
    heroAssetId: text("hero_asset_id").references(() => contentAssets.id, {
      onDelete: "set null",
    }),
    featured: boolean("featured").notNull().default(false),
    visible: boolean("visible").notNull().default(true),
    priority: integer("priority").notNull().default(0),
    category: text("category", {
      enum: ["React", "Architecture", "Performance", "Testing"],
    }),
    badges: jsonb("badges").$type<string[] | null>().default(null),
    status: text("status", { enum: ["published", "draft"] })
      .notNull()
      .default("published"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("content_article_slug_unique").on(table.slug),
    visibleIdx: index("content_article_visible_idx").on(table.visible),
    heroAssetIdx: index("content_article_hero_asset_id_idx").on(
      table.heroAssetId
    ),
    publishedAtIdx: index("content_article_published_at_idx").on(
      table.publishedAt
    ),
  })
);

export const contentWordCloudConcepts = pgTable(
  "content_word_cloud_concept",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    weight: integer("weight").notNull().default(1),
    description: text("description").notNull(),
    relatedKeywords: jsonb("related_keywords")
      .$type<string[]>()
      .notNull()
      .default([]),
    technologies: jsonb("technologies")
      .$type<Array<{ name: string; icon: string }>>()
      .notNull()
      .default([]),
    companies: jsonb("companies").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    weightIdx: index("content_word_cloud_concept_weight_idx").on(table.weight),
  })
);
