export const ROLES = {
  ADMIN: "admin",
  OPERATOR: "operator",
  GUEST: "guest",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Role[] = [
  ROLES.GUEST,
  ROLES.OPERATOR,
  ROLES.ADMIN,
];
