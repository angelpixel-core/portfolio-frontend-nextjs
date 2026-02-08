/**
 * Navigation Items Mock Data
 *
 * Navigation can be configured via environment variable:
 * NEXT_PUBLIC_NAV_ITEMS (JSON array)
 *
 * In production, this data comes from the backend API.
 *
 * @see .env.template for configuration
 */
import { logger } from "@/lib/logger";
import type { NavigationItemsModel } from "./schema";

/**
 * Default navigation items
 * Used when NEXT_PUBLIC_NAV_ITEMS is not set
 */
const defaultNavItems: NavigationItemsModel = [
  { id: 1, href: "/", name: "home" },
  { id: 2, href: "/about", name: "about" },
  { id: 3, href: "/projects", name: "projects" },
  { id: 4, href: "/articles", name: "articles" },
];

/**
 * Get navigation items from env or defaults
 */
export const getNavigationItems = (): NavigationItemsModel => {
  const envNavItems = process.env.NEXT_PUBLIC_NAV_ITEMS;

  if (envNavItems) {
    try {
      return JSON.parse(envNavItems) as NavigationItemsModel;
    } catch (e) {
      logger.warn(
        "NavItem",
        "Failed to parse NEXT_PUBLIC_NAV_ITEMS, using defaults"
      );
      return defaultNavItems;
    }
  }

  return defaultNavItems;
};

/**
 * Default export for backward compatibility with model/index.ts
 */
const navigationItemsMock: NavigationItemsModel = defaultNavItems;

export default navigationItemsMock;
