import { PERMISSIONS } from "@/application/authz";
import {
  evaluatePermissionAccess,
  getEnforcementMode,
  normalizeEmail,
} from "@/lib/admin/permissionAccess";

describe("permissionAccess", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.RBAC_ENFORCEMENT_MODE;
    delete process.env.ADMIN_EMAILS;
    delete process.env.OPERATOR_EMAILS;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("normalizes emails safely", () => {
    expect(normalizeEmail("  Admin@Example.com ")).toBe("admin@example.com");
    expect(normalizeEmail(undefined)).toBe("");
  });

  it("defaults to legacy mode for unknown values", () => {
    process.env.RBAC_ENFORCEMENT_MODE = "unexpected";

    expect(getEnforcementMode()).toBe("legacy");
  });

  it("uses legacy allowlist in legacy mode", () => {
    process.env.RBAC_ENFORCEMENT_MODE = "legacy";
    process.env.ADMIN_EMAILS = "admin@angelpixel.io";
    process.env.OPERATOR_EMAILS = "operator@angelpixel.io";

    const operator = evaluatePermissionAccess(
      "operator@angelpixel.io",
      PERMISSIONS.CONTENT_WRITE
    );

    expect(operator.mode).toBe("legacy");
    expect(operator.legacyAllowed).toBe(false);
    expect(operator.rbacAllowed).toBe(true);
    expect(operator.allowed).toBe(false);
  });

  it("uses RBAC decision in enforce mode", () => {
    process.env.RBAC_ENFORCEMENT_MODE = "enforce";
    process.env.ADMIN_EMAILS = "admin@angelpixel.io";
    process.env.OPERATOR_EMAILS = "operator@angelpixel.io";

    const operator = evaluatePermissionAccess(
      "operator@angelpixel.io",
      PERMISSIONS.CONTENT_WRITE
    );

    expect(operator.mode).toBe("enforce");
    expect(operator.legacyAllowed).toBe(false);
    expect(operator.rbacAllowed).toBe(true);
    expect(operator.allowed).toBe(true);
  });

  it("logs divergence in shadow mode", () => {
    process.env.RBAC_ENFORCEMENT_MODE = "shadow";
    process.env.ADMIN_EMAILS = "admin@angelpixel.io";
    process.env.OPERATOR_EMAILS = "operator@angelpixel.io";
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const result = evaluatePermissionAccess(
      "operator@angelpixel.io",
      PERMISSIONS.CONTENT_WRITE
    );

    expect(result.mode).toBe("shadow");
    expect(result.allowed).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      "[RBAC:SHADOW] authorization divergence",
      expect.objectContaining({
        email: "operator@angelpixel.io",
        permission: PERMISSIONS.CONTENT_WRITE,
        legacyAllowed: false,
        rbacAllowed: true,
      })
    );

    warnSpy.mockRestore();
  });
});
