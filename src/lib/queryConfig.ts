/**
 * Query Configuration Constants
 *
 * Centralized cache configuration for React Query hooks.
 * All domain hooks use these defaults for consistent caching behavior.
 *
 * Cache Strategy:
 * - staleTime: Data is considered fresh for 5 minutes. No refetch during this window.
 * - gcTime: Inactive data is garbage collected after 10 minutes (was cacheTime in v4).
 *
 * This strategy balances:
 * - User experience: Fresh data without excessive refetching
 * - Performance: Reduced API calls for repeated navigation
 * - Memory: Reasonable cache lifetime for single-page sessions
 */

/** Data is considered fresh for 5 minutes - no refetch during this window */
export const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

/** Inactive data is garbage collected after 10 minutes */
export const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes
