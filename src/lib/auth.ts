import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { schema } from "../db/schema";

const microsoftClientId =
  process.env.MICROSOFT_CLIENT_ID ?? process.env.AZURE_AD_CLIENT_ID ?? "";
const microsoftClientSecret =
  process.env.MICROSOFT_CLIENT_SECRET ??
  process.env.AZURE_AD_CLIENT_SECRET ??
  "";
const microsoftTenantId =
  process.env.MICROSOFT_TENANT_ID ?? process.env.AZURE_AD_TENANT_ID ?? "";

const socialProviders: Record<string, Record<string, string>> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  socialProviders.linkedin = {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  };
}

if (microsoftClientId && microsoftClientSecret) {
  socialProviders.microsoft = {
    clientId: microsoftClientId,
    clientSecret: microsoftClientSecret,
    tenantId: microsoftTenantId || "common",
    authority: "https://login.microsoftonline.com",
    prompt: "select_account",
  };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
});
