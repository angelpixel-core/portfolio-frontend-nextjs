export interface AuthUser {
  email: string;
  name?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export type OAuthProvider = "google" | "linkedin" | "microsoft";

export interface OAuthCredentials {
  provider: OAuthProvider;
  token?: string;
}
