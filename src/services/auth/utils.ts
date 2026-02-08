import type { AuthUser } from "./types";

/**
 * Extract display initials from an AuthUser.
 *
 * - Full name "John Doe" → "JD" (first letter of first two words)
 * - Single name "John" → "J"
 * - No name, email "john@..." → "J" (first letter of email)
 */
export const getInitials = (user: AuthUser): string => {
  const name = user.name?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  return "?";
};
