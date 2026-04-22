import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { user } from "../../../db/schema";

type UserRecord = {
  id: string;
  email: string;
  name: string;
};

const fallbackNameFromEmail = (email: string): string => {
  const local = email.split("@")[0]?.trim();
  if (!local) {
    return "Customer";
  }

  return local.slice(0, 80);
};

const findByEmail = async (email: string): Promise<UserRecord | null> => {
  const rows = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return rows[0] ?? null;
};

const findOrCreateByEmail = async (email: string): Promise<UserRecord> => {
  const existing = await findByEmail(email);
  if (existing) {
    return existing;
  }

  const now = new Date();
  const inserted = await db
    .insert(user)
    .values({
      id: randomUUID(),
      email,
      name: fallbackNameFromEmail(email),
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning({
      id: user.id,
      email: user.email,
      name: user.name,
    });

  if (inserted[0]) {
    return inserted[0];
  }

  const raced = await findByEmail(email);
  if (!raced) {
    throw new Error("Failed to resolve user by email after upsert");
  }

  return raced;
};

const model = {
  findByEmail,
  findOrCreateByEmail,
};

export default model;
