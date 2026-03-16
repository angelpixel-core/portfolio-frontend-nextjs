/**
 * Contact Points Mock Data
 *
 * Static contact point fixtures used for tests and local development.
 */
import { buildSocialUrl } from "@/lib/social-urls";
import type { ContactPointModel, ContactPointsModel } from "./schema";

/**
 * Build contact point entry with static URL
 */
const createContactPoint = (
  id: number,
  type: ContactPointModel["type"],
  provider: ContactPointModel["provider"],
  label: string,
  icon: string,
  fallbackId: string
): ContactPointModel => {
  const url = buildSocialUrl(provider, fallbackId) || "#";
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
    href: "mailto:contact@example.com",
    value: "contact@example.com",
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
