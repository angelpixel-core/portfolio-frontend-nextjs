import { AuthResult, OAuthProvider } from "./types";
import { mockOAuthLogin, mockLogout } from "./mock";

/**
 * OAuthService — Provider-agnostic interface for OAuth authentication.
 *
 * ## Contract for Rails Backend Integration
 *
 * When the Rails backend is ready, replace `MockOAuthService` with a real
 * implementation that:
 *
 * 1. `initiateOAuth(provider)` — Redirects the browser to the OAuth
 *    authorization URL (e.g., `/api/auth/signin?provider=google`).
 *    The Rails backend handles the OAuth dance and issues an httpOnly cookie.
 *
 * 2. `handleCallback(params)` — Called after the OAuth redirect returns.
 *    Reads the session from the httpOnly cookie set by Rails and returns
 *    the authenticated user data.
 *
 * ### Security Requirements (Real Implementation)
 * - Tokens MUST be stored in httpOnly cookies (Rails backend responsibility)
 * - CSRF protection via `state` parameter in OAuth flow
 * - PKCE for SPA security (`code_verifier` + `code_challenge`)
 * - Never store tokens in localStorage (XSS vulnerability)
 *
 * @see Epic 16 — Auth System & Session UI
 */
export interface OAuthService {
  /** Start the OAuth flow for a given provider. */
  initiateOAuth(_provider: OAuthProvider): Promise<void>;

  /**
   * Handle the OAuth callback after redirect.
   * @param _params - URL search params from the callback redirect
   * @returns AuthResult with the authenticated user or an error
   */
  handleCallback(_params: Record<string, string>): Promise<AuthResult>;
}

/**
 * MockOAuthService — Simulates the OAuth flow using mock data.
 *
 * Used during development while the Rails backend is not available.
 * `initiateOAuth` resolves the full flow in-place (no redirect).
 */
export class MockOAuthService implements OAuthService {
  private lastResult: AuthResult | null = null;

  async initiateOAuth(provider: OAuthProvider): Promise<void> {
    this.lastResult = await mockOAuthLogin(provider);
  }

  async handleCallback(): Promise<AuthResult> {
    if (this.lastResult) {
      const result = this.lastResult;
      this.lastResult = null;
      return result;
    }

    return {
      success: false,
      error: "No OAuth flow was initiated",
    };
  }
}

/**
 * Feature flag: `NEXT_PUBLIC_OAUTH_ENABLED`
 *
 * When `"true"`, a real OAuthService implementation should be used.
 * Currently only MockOAuthService is available — the flag is read but
 * always falls back to mock until the Rails backend provides a real
 * implementation.
 */
const isOAuthEnabled = process.env.NEXT_PUBLIC_OAUTH_ENABLED === "true";

/** OAuth service instance — mock for development, real when backend is ready. */
export const oauthService: OAuthService = isOAuthEnabled
  ? new MockOAuthService() // TODO: Replace with RealOAuthService when Rails backend is ready
  : new MockOAuthService();

/**
 * Convenience function for UI components — performs the full OAuth flow
 * (initiate + callback) in a single async call.
 *
 * UI components should call this instead of importing `mockOAuthLogin`
 * directly, so that switching to a real OAuth provider only requires
 * changing the `oauthService` implementation.
 */
export const performOAuthLogin = async (
  provider: OAuthProvider
): Promise<AuthResult> => {
  await oauthService.initiateOAuth(provider);
  return oauthService.handleCallback({});
};

/**
 * Convenience function for logout — calls the mock/real logout service.
 *
 * When Rails backend is ready, this will call `POST /api/auth/signout`
 * to revoke the session server-side. Currently uses `mockLogout()`.
 */
export const performLogout = async (): Promise<AuthResult> => {
  return mockLogout();
};
