/**
 * Navigation Items Mock Data
 *
 * Static navigation fixtures used for tests and local development.
 */
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
 * Get navigation items from defaults
 */
export const getNavigationItems = (): NavigationItemsModel => {
  return defaultNavItems;
};

/**
 * Default export for backward compatibility with model/index.ts
 */
const navigationItemsMock: NavigationItemsModel = defaultNavItems;

export default navigationItemsMock;
