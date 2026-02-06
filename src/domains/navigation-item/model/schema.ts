import { z } from "zod";

/**
 * Navigation Item Schema
 *
 * Represents navigation links for the site menu.
 * Can be configured via NEXT_PUBLIC_NAV_ITEMS environment variable.
 */
export const NavigationItemSchema = z.object({
  id: z.number(),
  href: z.string(),
  name: z.string(),
});

export const NavigationItemsSchema = z.array(NavigationItemSchema);

// Inferred types from Zod schemas
export type NavigationItemModel = z.infer<typeof NavigationItemSchema>;
export type NavigationItemsModel = z.infer<typeof NavigationItemsSchema>;
