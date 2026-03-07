/**
 * Query Hook Factory
 *
 * Factory functions for creating React Query hooks with consistent configuration.
 * Reduces boilerplate by ~80% while maintaining full type safety.
 *
 * Usage:
 *   // For fetchAll hooks
 *   export const useArticles = createFetchAllHook<Articles>({
 *     queryKey: "articles",
 *     fetchFn: () => model.fetchAll(),
 *   });
 *
 *   // For fetchById hooks
 *   export const useArticle = createFetchByIdHook<Article, number>({
 *     queryKey: "article",
 *     fetchFn: (id) => model.fetchById(id),
 *   });
 *
 *   // With enabled override
 *   useArticle(id, { enabled: false });
 */

import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from "./queryConfig";

/**
 * Options for createFetchAllHook factory
 */
interface FetchAllHookOptions<T> {
  /** Query key for caching (e.g., "articles", "projects") */
  queryKey: string;
  /** Function that fetches all items */
  fetchFn: () => Promise<T>;
  /** Optional: Override stale time (default: 5 minutes) */
  staleTime?: number;
  /** Optional: Override garbage collection time (default: 10 minutes) */
  gcTime?: number;
  initialData?: T;
}

/**
 * Options for createFetchByIdHook factory
 */
interface FetchByIdHookOptions<T, P> {
  /** Query key prefix for caching (e.g., "article", "project") */
  queryKey: string;
  /** Function that fetches item by parameter */
  fetchFn: (_param: P) => Promise<T | null>;
  /** Optional: Override stale time (default: 5 minutes) */
  staleTime?: number;
  /** Optional: Override garbage collection time (default: 10 minutes) */
  gcTime?: number;
}

/**
 * Runtime options that can be passed when calling the hook
 */
interface RuntimeHookOptions {
  /** Override the default enabled behavior */
  enabled?: boolean;
}

/**
 * Creates a hook for fetching all items of a domain.
 *
 * @example
 * export const useArticles = createFetchAllHook<Articles>({
 *   queryKey: "articles",
 *   fetchFn: () => model.fetchAll(),
 * });
 */
export function createFetchAllHook<T>(
  options: FetchAllHookOptions<T>
): () => UseQueryResult<T, Error> {
  const {
    queryKey,
    fetchFn,
    staleTime = DEFAULT_STALE_TIME,
    gcTime = DEFAULT_GC_TIME,
    initialData,
  } = options;

  return function useFetchAll(): UseQueryResult<T, Error> {
    return useQuery<T, Error>({
      queryKey: [queryKey],
      queryFn: () => fetchFn(),
      staleTime,
      gcTime,
      initialData,
    });
  };
}

/**
 * Creates a hook for fetching a single item by parameter (id, slug, etc).
 *
 * @example
 * // With numeric id
 * export const useArticle = createFetchByIdHook<Article, number>({
 *   queryKey: "article",
 *   fetchFn: (id) => model.fetchById(id),
 * });
 *
 * // With string slug
 * export const useProject = createFetchByIdHook<Project, string>({
 *   queryKey: "project",
 *   fetchFn: (slug) => model.fetchBySlug(slug),
 * });
 *
 * // Usage with enabled override (can only disable, not enable without param):
 * const result = useArticle(id, { enabled: false });
 *
 * @note enabled: true with param undefined is not supported - param must be
 * truthy for the query to run. This prevents runtime errors from fetchFn(undefined).
 */
export function createFetchByIdHook<T, P = string>(
  options: FetchByIdHookOptions<T, P>
): (
  _param: P | undefined,
  _runtimeOptions?: RuntimeHookOptions
) => UseQueryResult<T | null, Error> {
  const {
    queryKey,
    fetchFn,
    staleTime = DEFAULT_STALE_TIME,
    gcTime = DEFAULT_GC_TIME,
  } = options;

  return function useFetchById(
    param: P | undefined,
    runtimeOptions: RuntimeHookOptions = {}
  ): UseQueryResult<T | null, Error> {
    // Param must be truthy for query to run. enabled override can only disable.
    // This prevents runtime errors from calling fetchFn(undefined).
    const hasParam = !!param;
    const enabled = hasParam && (runtimeOptions.enabled ?? true);

    return useQuery<T | null, Error>({
      queryKey: [queryKey, param],
      queryFn: () => fetchFn(param as P),
      staleTime,
      gcTime,
      enabled,
    });
  };
}
