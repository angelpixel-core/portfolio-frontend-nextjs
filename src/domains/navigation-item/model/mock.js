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

/**
 * Default navigation items
 * Used when NEXT_PUBLIC_NAV_ITEMS is not set
 */
const defaultNavItems = [
  { id: 1, href: "/", name: "home" },
  { id: 2, href: "/about", name: "about" },
  { id: 3, href: "/projects", name: "projects" },
  { id: 4, href: "/articles", name: "articles" },
];

/**
 * Get navigation items from env or defaults
 * @returns {Array<{id: number, href: string, name: string}>}
 */
export const getNavigationItems = () => {
  const envNavItems = process.env.NEXT_PUBLIC_NAV_ITEMS;

  if (envNavItems) {
    try {
      return JSON.parse(envNavItems);
    } catch (e) {
      console.warn("Failed to parse NEXT_PUBLIC_NAV_ITEMS, using defaults");
      return defaultNavItems;
    }
  }

  return defaultNavItems;
};

/**
 * Default export for backward compatibility with model/index.js
 */
const navigationItemsMock = defaultNavItems;

export default navigationItemsMock;
