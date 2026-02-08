import { mockLogin, mockSignup, mockLogout } from "../mock";

describe("mock auth service", () => {
  describe("mockLogin", () => {
    it("returns success for valid credentials", async () => {
      const result = await mockLogin("user@test.com", "password123");
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        email: "user@test.com",
        name: "Test User",
      });
    });

    it("returns error for invalid credentials", async () => {
      const result = await mockLogin("wrong@test.com", "wrongpass");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password");
      expect(result.user).toBeUndefined();
    });

    it("returns error for correct email but wrong password", async () => {
      const result = await mockLogin("user@test.com", "wrongpass");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password");
    });
  });

  describe("mockSignup", () => {
    it("returns success for new user", async () => {
      const result = await mockSignup(
        "new@test.com",
        "password123",
        "New User"
      );
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        email: "new@test.com",
        name: "New User",
      });
    });

    it("derives name from email when not provided", async () => {
      const result = await mockSignup("john@test.com", "password123");
      expect(result.success).toBe(true);
      expect(result.user?.name).toBe("john");
    });

    it("returns error for existing email", async () => {
      const result = await mockSignup("existing@test.com", "password123");
      expect(result.success).toBe(false);
      expect(result.error).toBe("An account with this email already exists");
    });

    it("returns error for short password", async () => {
      const result = await mockSignup("new@test.com", "short");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Password must be at least 8 characters");
    });
  });

  describe("mockLogout", () => {
    it("returns success", async () => {
      const result = await mockLogout();
      expect(result.success).toBe(true);
    });
  });
});
