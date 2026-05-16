import { resolveRoleFromEmail, ROLES } from "@/application/authz";

describe("resolveRoleFromEmail", () => {
  it("returns guest when email is empty", () => {
    expect(resolveRoleFromEmail(null)).toBe(ROLES.GUEST);
    expect(resolveRoleFromEmail("")).toBe(ROLES.GUEST);
  });

  it("returns admin when email is in ADMIN_EMAILS allowlist", () => {
    const role = resolveRoleFromEmail("Admin@Example.com", {
      adminEmails: "admin@example.com, another@example.com",
      operatorEmails: "operator@example.com",
    });

    expect(role).toBe(ROLES.ADMIN);
  });

  it("returns operator when email is in OPERATOR_EMAILS allowlist", () => {
    const role = resolveRoleFromEmail("operator@example.com", {
      adminEmails: "admin@example.com",
      operatorEmails: "operator@example.com,op2@example.com",
    });

    expect(role).toBe(ROLES.OPERATOR);
  });

  it("prioritizes admin when email appears in both lists", () => {
    const role = resolveRoleFromEmail("dupe@example.com", {
      adminEmails: "dupe@example.com",
      operatorEmails: "dupe@example.com",
    });

    expect(role).toBe(ROLES.ADMIN);
  });

  it("returns guest when email is not in any allowlist", () => {
    const role = resolveRoleFromEmail("guest@example.com", {
      adminEmails: "admin@example.com",
      operatorEmails: "operator@example.com",
    });

    expect(role).toBe(ROLES.GUEST);
  });
});
