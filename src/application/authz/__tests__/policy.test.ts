import {
  PERMISSIONS,
  getPermissionsForRole,
  hasPermission,
  ROLES,
} from "@/application/authz";

describe("authz policy", () => {
  it("gives admin full permission set", () => {
    const adminPermissions = getPermissionsForRole(ROLES.ADMIN);
    Object.values(PERMISSIONS).forEach((permission) => {
      expect(adminPermissions.has(permission)).toBe(true);
    });
  });

  it("grants operator expected management permissions", () => {
    expect(hasPermission(ROLES.OPERATOR, PERMISSIONS.ADMIN_PANEL_ACCESS)).toBe(
      true
    );
    expect(hasPermission(ROLES.OPERATOR, PERMISSIONS.CONTENT_WRITE)).toBe(true);
    expect(hasPermission(ROLES.OPERATOR, PERMISSIONS.SETTINGS_MANAGE)).toBe(
      false
    );
  });

  it("denies guest admin permissions", () => {
    expect(hasPermission(ROLES.GUEST, PERMISSIONS.ADMIN_PANEL_ACCESS)).toBe(
      false
    );
    expect(hasPermission(ROLES.GUEST, PERMISSIONS.CONTENT_READ)).toBe(false);
  });
});
