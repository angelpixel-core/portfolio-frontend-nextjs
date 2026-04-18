import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

const twoFactorPlugin =
  typeof twoFactorClient === "function" ? twoFactorClient() : null;

export const authClient = createAuthClient({
  plugins: twoFactorPlugin ? [twoFactorPlugin] : [],
});
