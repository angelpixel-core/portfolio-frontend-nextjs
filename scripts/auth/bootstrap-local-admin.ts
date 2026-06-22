import "dotenv/config";

import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";

import { auth } from "../../src/lib/auth";
import { db } from "../../src/db";
import { account, user } from "../../src/db/schema";

const DEFAULT_EMAIL = "admin@local.com";
const DEFAULT_PASSWORD = "123456";
const DEFAULT_NAME = "Local Admin";
const CREDENTIAL_PROVIDER = "credential";

const normalize = (value: string | undefined, fallback: string): string => {
  const next = value?.trim();
  return next ? next : fallback;
};

async function main() {
  const email = normalize(process.env.ADMIN_BOOTSTRAP_EMAIL, DEFAULT_EMAIL)
    .toLowerCase();
  const password = normalize(
    process.env.ADMIN_BOOTSTRAP_PASSWORD,
    DEFAULT_PASSWORD
  );
  const name = normalize(process.env.ADMIN_BOOTSTRAP_NAME, DEFAULT_NAME);

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(password);

  const existingUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  const userId = existingUser[0]?.id ?? randomUUID();
  const now = new Date();

  if (existingUser.length === 0) {
    await db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      twoFactorEnabled: false,
      image: null,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db
      .update(user)
      .set({
        name,
        emailVerified: true,
        updatedAt: now,
      })
      .where(eq(user.id, userId));
  }

  const credentialAccount = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, CREDENTIAL_PROVIDER)))
    .limit(1);

  if (credentialAccount.length === 0) {
    await db.insert(account).values({
      id: randomUUID(),
      userId,
      accountId: userId,
      providerId: CREDENTIAL_PROVIDER,
      password: passwordHash,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      idToken: null,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db
      .update(account)
      .set({
        accountId: userId,
        password: passwordHash,
        updatedAt: now,
      })
      .where(
        and(eq(account.userId, userId), eq(account.providerId, CREDENTIAL_PROVIDER))
      );
  }

  console.log(
    `Bootstrapped admin user ${email} with password ${password} and user id ${userId}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
