import type { AuthUser } from "./types";

export const AUTH_SESSION_KEY = "auth_session";
export const AUTH_SESSION_TTL_MS = 604_800_000; // 7 days

interface StoredSession {
  user: AuthUser;
  timestamp: number;
}

export const saveSession = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  try {
    const session: StoredSession = { user, timestamp: Date.now() };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage full or unavailable — fail silently
  }
};

export const loadSession = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;

    const session: StoredSession = JSON.parse(raw);
    if (!session.user?.email || typeof session.timestamp !== "number") {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
    if (Date.now() - session.timestamp > AUTH_SESSION_TTL_MS) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
    return session.user;
  } catch {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
};

export const clearSession = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // fail silently
  }
};
