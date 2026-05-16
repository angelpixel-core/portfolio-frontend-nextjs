import { auth } from "@/lib/auth";
import { type Permission } from "@/application/authz";
import {
  evaluatePermissionAccess,
  normalizeEmail,
} from "@/lib/admin/permissionAccess";

export const requireApiPermission = async (
  requestHeaders: Headers,
  permission: Permission
): Promise<string | null> => {
  const session = await auth.api.getSession({ headers: requestHeaders });
  const email = normalizeEmail(session?.user?.email);
  const { allowed } = evaluatePermissionAccess(email, permission);
  return allowed ? email : null;
};
