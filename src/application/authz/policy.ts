import { PERMISSIONS, type Permission } from "./permissions";
import { ROLES, type Role } from "./roles";

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  [ROLES.GUEST]: new Set<Permission>(),
  [ROLES.OPERATOR]: new Set<Permission>([
    PERMISSIONS.ADMIN_PANEL_ACCESS,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_WRITE,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.SUBSCRIPTIONS_MANAGE,
    PERMISSIONS.RESUME_REQUESTS_MANAGE,
  ]),
  [ROLES.ADMIN]: new Set<Permission>(Object.values(PERMISSIONS)),
};

export const getPermissionsForRole = (role: Role): ReadonlySet<Permission> => {
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS[ROLES.GUEST];
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return getPermissionsForRole(role).has(permission);
};
