import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  contentAssets,
  contentProjects,
  contentArticles,
  contentWordCloudConcepts,
} from "./schema/content-admin";
import {
  resumeRequestLinks,
  resumeRequestSubmissions,
} from "./schema/resume-request";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    mode: "date",
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    mode: "date",
  }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const twoFactor = pgTable("user_two_factor", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret"),
  backupCodes: text("backup_codes"),
  secretEncrypted: text("secret_encrypted"),
  pendingSecretEncrypted: text("pending_secret_encrypted"),
  recoveryCodesHash: text("recovery_codes_hash"),
  enabled: boolean("enabled").notNull().default(false),
  enabledAt: timestamp("enabled_at", { mode: "date" }),
  lastVerifiedAt: timestamp("last_verified_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const activity = pgTable("activity", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  status: text("status").notNull(),
  event: text("event").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  email: text("email"),
  productKey: text("product_key").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  status: text("status", { enum: ["pending", "paid", "failed"] })
    .notNull()
    .default("pending"),
  provider: text("provider").notNull().default("stripe"),
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const access = pgTable(
  "access",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productKey: text("product_key").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userProductUnique: uniqueIndex("access_user_id_product_key_unique").on(
      table.userId,
      table.productKey
    ),
  })
);

export const webhookEvents = pgTable("webhook_event", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processed: boolean("processed").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const orderAdminActions = pgTable("order_admin_action", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  reason: text("reason"),
  beforeState: text("before_state"),
  afterState: text("after_state"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status", {
      enum: [
        "pending_confirmation",
        "subscribed",
        "unsubscribed",
        "bounced",
        "complained",
      ],
    })
      .notNull()
      .default("pending_confirmation"),
    source: text("source"),
    articleSlug: text("article_slug"),
    locale: text("locale"),
    confirmedAt: timestamp("confirmed_at", { mode: "date" }),
    unsubscribedAt: timestamp("unsubscribed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("subscriptions_email_unique").on(table.email),
    statusIdx: index("subscriptions_status_idx").on(table.status),
    createdAtIdx: index("subscriptions_created_at_idx").on(table.createdAt),
  })
);

export const subscriptionEvents = pgTable(
  "subscription_event",
  {
    id: text("id").primaryKey(),
    subscriptionId: text("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: [
        "created",
        "confirm_sent",
        "confirmed",
        "unsubscribed",
        "resubscribed",
        "bounced",
        "complained",
      ],
    }).notNull(),
    payload: text("payload"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    subscriptionIdx: index("subscription_event_subscription_id_idx").on(
      table.subscriptionId
    ),
    typeIdx: index("subscription_event_type_idx").on(table.type),
  })
);

export const jobExperiences = pgTable(
  "job_experience",
  {
    id: integer("id").primaryKey(),
    publish: boolean("publish").notNull().default(true),
    position: text("position").notNull(),
    company: text("company").notNull(),
    companyLink: text("company_link").notNull(),
    time: text("time").notNull(),
    year: text("year").notNull(),
    address: text("address").notNull().default(""),
    contextBadges: text("context_badges").array().notNull().default([]),
    technologies: text("technologies").array().notNull().default([]),
    group: text("group", { enum: ["engineering", "platform"] }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    groupIdx: index("job_experience_group_idx").on(table.group),
    publishIdx: index("job_experience_publish_idx").on(table.publish),
  })
);

export const jobExperienceTasks = pgTable(
  "job_experience_task",
  {
    id: text("id").primaryKey(),
    jobExperienceId: integer("job_experience_id")
      .notNull()
      .references(() => jobExperiences.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    description: text("description").notNull(),
    tags: text("tags").array(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    jobExperienceIdx: index("job_experience_task_job_experience_id_idx").on(
      table.jobExperienceId
    ),
    sortOrderIdx: index("job_experience_task_sort_order_idx").on(
      table.sortOrder
    ),
  })
);

export const siteProfiles = pgTable("site_profile", {
  id: integer("id").primaryKey(),
  nickname: text("nickname").notNull(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  biography: text("biography").array().notNull().default([]),
  avatar: text("avatar").notNull(),
  logo: text("logo"),
  location: text("location").notNull(),
  email: text("email").notNull(),
  resume: text("resume"),
  heroLink: text("hero_link"),
  hireMeLink: text("hire_me_link"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const siteContactPoints = pgTable(
  "site_contact_point",
  {
    id: integer("id").primaryKey(),
    type: text("type", {
      enum: ["communication", "social", "messaging"],
    }).notNull(),
    provider: text("provider", {
      enum: [
        "email",
        "linkedin",
        "github",
        "whatsapp",
        "twitter",
        "dribbble",
        "telegram",
        "calendly",
      ],
    }).notNull(),
    label: text("label").notNull(),
    icon: text("icon").notNull(),
    identifier: text("identifier").notNull(),
    href: text("href").notNull(),
    value: text("value").notNull(),
    visible: boolean("visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    providerUnique: uniqueIndex("site_contact_point_provider_unique").on(
      table.provider
    ),
    visibleIdx: index("site_contact_point_visible_idx").on(table.visible),
    sortOrderIdx: index("site_contact_point_sort_order_idx").on(
      table.sortOrder
    ),
  })
);

export const userTwoFactor = twoFactor;

export const schema = {
  user,
  session,
  account,
  verification,
  twoFactor,
  activity,
  orders,
  access,
  webhookEvents,
  orderAdminActions,
  subscriptions,
  subscriptionEvents,
  jobExperiences,
  jobExperienceTasks,
  siteProfiles,
  siteContactPoints,
  contentAssets,
  contentProjects,
  contentArticles,
  contentWordCloudConcepts,
  resumeRequestLinks,
  resumeRequestSubmissions,
};

export {
  contentAssets,
  contentProjects,
  contentArticles,
  contentWordCloudConcepts,
};
export { resumeRequestLinks, resumeRequestSubmissions };
