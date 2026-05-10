import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/about", "/projects", "/articles"];

const EXPECTED_HEADERS = {
  "content-security-policy": {
    contains: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self'",
      "blob:",
      "data:",
      "font-src 'self'",
      "object-src 'none'",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ],
  },
  "x-content-type-options": { exact: "nosniff" },
  "x-frame-options": { exact: "DENY" },
  "x-xss-protection": { exact: "1; mode=block" },
  "referrer-policy": { exact: "strict-origin-when-cross-origin" },
  "permissions-policy": { exact: "camera=(), microphone=(), geolocation=()" },
} as const;

test.describe("Security Headers (Story 19.3)", () => {
  for (const route of ROUTES) {
    test(`all security headers present on ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response).not.toBeNull();
      const headers = response!.headers();

      for (const [header, rule] of Object.entries(EXPECTED_HEADERS)) {
        const value = headers[header];
        expect(value, `Missing header: ${header}`).toBeDefined();

        if ("exact" in rule) {
          expect(value).toBe(rule.exact);
        }

        if ("contains" in rule) {
          for (const directive of rule.contains) {
            expect(value, `CSP missing directive: ${directive}`).toContain(
              directive,
            );
          }
        }
      }
    });
  }

  test("CSP includes unsafe-eval in development", async ({ page }) => {
    const response = await page.goto("/");
    const csp = response!.headers()["content-security-policy"];
    // Dev server (port 9000) should include unsafe-eval for HMR
    expect(csp).toContain("'unsafe-eval'");
  });

  test("CSP has no excessive whitespace", async ({ page }) => {
    const response = await page.goto("/");
    const csp = response!.headers()["content-security-policy"];
    // Should not contain consecutive spaces (M1 fix)
    expect(csp).not.toMatch(/\s{2,}/);
  });
});
