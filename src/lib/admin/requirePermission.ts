import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { type Permission } from "@/application/authz";
import {
  evaluatePermissionAccess,
  normalizeEmail,
} from "@/lib/admin/permissionAccess";

export const requirePermission = async (
  permission: Permission,
  redirectTo = "/"
): Promise<void> => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const email = normalizeEmail(session?.user?.email);
  const { allowed } = evaluatePermissionAccess(email, permission);

  if (!allowed) {
    redirect(redirectTo);
  }
};
