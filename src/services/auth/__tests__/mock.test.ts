import {
  mockLogin,
  mockSignup,
  mockLogout,
  mockOAuthLogin,
  type OAuthProvider,
} from "@/application/auth";

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

  describe("mockOAuthLogin", () => {
    it("returns user with gmail email for google provider", async () => {
      const result = await mockOAuthLogin("google");
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        email: "john.doe@gmail.com",
        name: "John Doe",
      });
    });

    it("returns user with linkedin email for linkedin provider", async () => {
      const result = await mockOAuthLogin("linkedin");
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        email: "john.doe@linkedin.com",
        name: "John Doe",
      });
    });

    it("returns user with outlook email for microsoft provider", async () => {
      const result = await mockOAuthLogin("microsoft");
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        email: "john.doe@outlook.com",
        name: "John Doe",
      });
    });

    it("returns error for unsupported provider", async () => {
      const result = await mockOAuthLogin(
        "invalid" as unknown as OAuthProvider
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe("Unsupported provider");
    });
  });
});
