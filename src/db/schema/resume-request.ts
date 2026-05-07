import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const resumeRequestLinks = pgTable(
  "resume_request_link",
  {
    id: text("id").primaryKey(),
    tokenHash: text("token_hash").notNull(),
    recipientName: text("recipient_name").notNull(),
    ttlDays: integer("ttl_days").notNull().default(7),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    usedAt: timestamp("used_at", { mode: "date" }),
    revokedAt: timestamp("revoked_at", { mode: "date" }),
    createdByAdminEmail: text("created_by_admin_email").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    tokenHashUnique: uniqueIndex("resume_request_link_token_hash_unique").on(
      table.tokenHash
    ),
    expiresAtIdx: index("resume_request_link_expires_at_idx").on(
      table.expiresAt
    ),
    usedAtIdx: index("resume_request_link_used_at_idx").on(table.usedAt),
    revokedAtIdx: index("resume_request_link_revoked_at_idx").on(
      table.revokedAt
    ),
  })
);

export const resumeRequestSubmissions = pgTable(
  "resume_request_submission",
  {
    id: text("id").primaryKey(),
    linkId: text("link_id")
      .notNull()
      .references(() => resumeRequestLinks.id, { onDelete: "restrict" }),
    email: text("email").notNull(),
    name: text("name").notNull(),
    context: text("context"),
    role: text("role"),
    company: text("company"),
    notes: text("notes"),
    status: text("status").notNull().default("requested"),
    origin: text("origin").notNull().default("on_demand_link"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("resume_request_submission_email_idx").on(table.email),
    statusIdx: index("resume_request_submission_status_idx").on(table.status),
    createdAtIdx: index("resume_request_submission_created_at_idx").on(
      table.createdAt
    ),
  })
);
