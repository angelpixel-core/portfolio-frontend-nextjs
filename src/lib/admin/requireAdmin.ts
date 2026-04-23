import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const getAdminAllowlist = (): Set<string> => {
  const raw = process.env.ADMIN_EMAILS ?? "";
  const values = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return new Set(values);
};

export const requireAdmin = async (): Promise<void> => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const sessionEmail = session?.user?.email?.toLowerCase() ?? "";
  const adminAllowlist = getAdminAllowlist();

  if (!sessionEmail || !adminAllowlist.has(sessionEmail)) {
    redirect("/");
  }
};
