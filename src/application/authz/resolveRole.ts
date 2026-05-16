import { ROLES, type Role } from "./roles";

type ResolveRoleOptions = {
  adminEmails?: string;
  operatorEmails?: string;
};

const toAllowlist = (raw: string): Set<string> => {
  return new Set(
    raw
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );
};

const normalizeEmail = (email: string | null | undefined): string => {
  return (email ?? "").trim().toLowerCase();
};

export const resolveRoleFromEmail = (
  email: string | null | undefined,
  options: ResolveRoleOptions = {}
): Role => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return ROLES.GUEST;

  const adminAllowlist = toAllowlist(
    options.adminEmails ?? process.env.ADMIN_EMAILS ?? ""
  );
  if (adminAllowlist.has(normalizedEmail)) return ROLES.ADMIN;

  const operatorAllowlist = toAllowlist(
    options.operatorEmails ?? process.env.OPERATOR_EMAILS ?? ""
  );
  if (operatorAllowlist.has(normalizedEmail)) return ROLES.OPERATOR;

  return ROLES.GUEST;
};
