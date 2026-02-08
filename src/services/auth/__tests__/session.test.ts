import {
  saveSession,
  loadSession,
  clearSession,
  AUTH_SESSION_KEY,
  AUTH_SESSION_TTL_MS,
} from "../session";

describe("session persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("saveSession", () => {
    it("persists user data with timestamp to localStorage", () => {
      const now = 1700000000000;
      jest.spyOn(Date, "now").mockReturnValue(now);

      saveSession({ email: "john@test.com", name: "John Doe" });

      const stored = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)!);
      expect(stored).toEqual({
        user: { email: "john@test.com", name: "John Doe" },
        timestamp: now,
      });
    });

    it("does not throw when localStorage is unavailable (SSR)", () => {
      const origWindow = globalThis.window;
      // @ts-expect-error — simulate SSR
      delete globalThis.window;

      expect(() => saveSession({ email: "john@test.com" })).not.toThrow();

      globalThis.window = origWindow;
    });
  });

  describe("loadSession", () => {
    it("returns user when valid session exists", () => {
      const now = Date.now();
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({
          user: { email: "john@test.com", name: "John" },
          timestamp: now,
        })
      );

      expect(loadSession()).toEqual({ email: "john@test.com", name: "John" });
    });

    it("returns null when no session exists", () => {
      expect(loadSession()).toBeNull();
    });

    it("returns null when session is expired", () => {
      const expired = Date.now() - AUTH_SESSION_TTL_MS - 1;
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ user: { email: "john@test.com" }, timestamp: expired })
      );

      expect(loadSession()).toBeNull();
    });

    it("returns null and clears corrupted data", () => {
      localStorage.setItem(AUTH_SESSION_KEY, "not-json");

      expect(loadSession()).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it("returns null when JSON is valid but structure is wrong", () => {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ foo: "bar" }));

      expect(loadSession()).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it("returns null when user has no email", () => {
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ user: { name: "John" }, timestamp: Date.now() })
      );

      expect(loadSession()).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it("returns null in SSR (no window)", () => {
      const origWindow = globalThis.window;
      // @ts-expect-error — simulate SSR
      delete globalThis.window;

      expect(loadSession()).toBeNull();

      globalThis.window = origWindow;
    });
  });

  describe("clearSession", () => {
    it("removes session from localStorage", () => {
      localStorage.setItem(AUTH_SESSION_KEY, "something");

      clearSession();

      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it("does not throw when localStorage is unavailable (SSR)", () => {
      const origWindow = globalThis.window;
      // @ts-expect-error — simulate SSR
      delete globalThis.window;

      expect(() => clearSession()).not.toThrow();

      globalThis.window = origWindow;
    });
  });
});
