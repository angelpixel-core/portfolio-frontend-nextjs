/**
 * Auth Hooks
 *
 * Semantic hooks for authentication state.
 * These wrap useAuthPanel to separate auth concerns from panel UI concerns.
 *
 * @example
 * import { useAuth, useUser, useIsAuthenticated } from '@/hooks';
 */
export { default as useAuth } from "./useAuth";
export { default as useUser } from "./useUser";
export { default as useIsAuthenticated } from "./useIsAuthenticated";
