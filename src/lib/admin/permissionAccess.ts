import {
  hasPermission,
  resolveRoleFromEmail,
  type Permission,
} from "@/application/authz";

export type EnforcementMode = "legacy" | "shadow" | "enforce";

const getAllowlist = (raw: string): Set<string> => {
  return new Set(
    raw
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );
};

export const normalizeEmail = (email: string | null | undefined): string => {
  return (email ?? "").trim().toLowerCase();
};

export const getEnforcementMode = (): EnforcementMode => {
  const mode = (process.env.RBAC_ENFORCEMENT_MODE ?? "legacy")
    .trim()
    .toLowerCase();
  if (mode === "shadow" || mode === "enforce") return mode;
  return "legacy";
};

const isLegacyAdmin = (email: string): boolean => {
  if (!email) return false;
  const admins = getAllowlist(process.env.ADMIN_EMAILS ?? "");
  return admins.has(email);
};

export const evaluatePermissionAccess = (
  email: string,
  permission: Permission
): {
  allowed: boolean;
  legacyAllowed: boolean;
  rbacAllowed: boolean;
  mode: EnforcementMode;
} => {
  const role = resolveRoleFromEmail(email);
  const legacyAllowed = isLegacyAdmin(email);
  const rbacAllowed = hasPermission(role, permission);
  const mode = getEnforcementMode();

  if (mode === "shadow" && legacyAllowed !== rbacAllowed) {
    console.warn("[RBAC:SHADOW] authorization divergence", {
      email,
      role,
      permission,
      legacyAllowed,
      rbacAllowed,
    });
  }

  const allowed = mode === "enforce" ? rbacAllowed : legacyAllowed;
  return { allowed, legacyAllowed, rbacAllowed, mode };
};
