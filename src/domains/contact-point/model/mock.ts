/**
 * Contact Points Mock Data
 *
 * URLs are built from environment variables using the pattern:
 * BASE_URL + IDENTIFIER (from NEXT_PUBLIC_{PROVIDER}_USERNAME)
 *
 * In production, this data comes from the backend API.
 *
 * @see .env.template for required variables
 * @see src/lib/social-urls for URL construction
 */
import { buildSocialUrl } from "@/lib/social-urls";
import type { ContactPointModel, ContactPointsModel } from "./schema";

/**
 * Build contact point entry with URL from env var
 */
const createContactPoint = (
  id: number,
  type: ContactPointModel["type"],
  provider: ContactPointModel["provider"],
  label: string,
  icon: string,
  fallbackId: string
): ContactPointModel => {
  const url =
    buildSocialUrl(provider) || buildSocialUrl(provider, fallbackId) || "#";
  return {
    id,
    type,
    provider,
    label,
    href: url,
    value: url,
    icon,
  };
};

const contactPointsMock: ContactPointsModel = [
  {
    id: 1,
    type: "communication",
    provider: "email",
    label: "Email",
    href:
      `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}` ||
      "mailto:contact@example.com",
    value: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",
    icon: "Mail",
  },
  createContactPoint(
    2,
    "social",
    "linkedin",
    "LinkedIn",
    "LinkedIn",
    "username"
  ),
  createContactPoint(3, "social", "github", "GitHub", "GitHub", "username"),
  createContactPoint(
    4,
    "communication",
    "whatsapp",
    "WhatsApp",
    "WhatsApp",
    "5491100000000"
  ),
  createContactPoint(5, "social", "twitter", "Twitter", "Twitter", "username"),
  createContactPoint(
    6,
    "social",
    "dribbble",
    "Dribbble",
    "Dribbble",
    "username"
  ),
  createContactPoint(
    7,
    "messaging",
    "telegram",
    "Telegram",
    "Telegram",
    "username"
  ),
];

export default contactPointsMock;
