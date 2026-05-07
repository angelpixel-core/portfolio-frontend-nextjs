import { z } from "zod";

/**
 * Zod schema for ContactPoint domain
 * Based on mock data structure from contact-point/model/mock.js
 */
export const ContactPointSchema = z.object({
  id: z.number(),
  type: z.enum(["communication", "social", "messaging"]),
  provider: z.enum([
    "email",
    "linkedin",
    "github",
    "whatsapp",
    "twitter",
    "dribbble",
    "telegram",
    "calendly",
  ]),
  label: z.string(),
  href: z.string(),
  value: z.string(),
  icon: z.string(),
});

export const ContactPointsSchema = z.array(ContactPointSchema);

export type ContactPointModel = z.infer<typeof ContactPointSchema>;
export type ContactPointsModel = z.infer<typeof ContactPointsSchema>;

export default ContactPointSchema;
