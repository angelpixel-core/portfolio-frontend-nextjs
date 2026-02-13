/**
 * Storybook-only fake contact point mock data (Lorem Ipsum)
 * Replaces real contact data via NormalModuleReplacementPlugin
 */
import type { ContactPointsModel } from "@/domains/contact-point/model/schema";

const contactPointsMock: ContactPointsModel = [
  {
    id: 1,
    type: "communication",
    provider: "email",
    label: "Email",
    href: "mailto:lorem@example.com",
    value: "lorem@example.com",
    icon: "Mail",
  },
  {
    id: 2,
    type: "social",
    provider: "linkedin",
    label: "LinkedIn",
    href: "https://example.com/in/loremipsum",
    value: "loremipsum",
    icon: "LinkedIn",
  },
  {
    id: 3,
    type: "social",
    provider: "github",
    label: "GitHub",
    href: "https://example.com/loremipsum",
    value: "loremipsum",
    icon: "GitHub",
  },
  {
    id: 4,
    type: "messaging",
    provider: "whatsapp",
    label: "WhatsApp",
    href: "https://example.com/loremipsum",
    value: "+0000000000",
    icon: "WhatsApp",
  },
  {
    id: 5,
    type: "social",
    provider: "twitter",
    label: "Twitter",
    href: "https://example.com/loremipsum",
    value: "loremipsum",
    icon: "Twitter",
  },
  {
    id: 6,
    type: "social",
    provider: "dribbble",
    label: "Dribbble",
    href: "https://example.com/loremipsum",
    value: "loremipsum",
    icon: "Dribbble",
  },
  {
    id: 7,
    type: "messaging",
    provider: "telegram",
    label: "Telegram",
    href: "https://example.com/loremipsum",
    value: "loremipsum",
    icon: "Telegram",
  },
];

export default contactPointsMock;
