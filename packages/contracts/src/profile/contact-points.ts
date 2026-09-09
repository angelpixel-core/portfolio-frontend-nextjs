import { z } from "zod";

export const ContactPointTypeSchema = z.enum([
  "communication",
  "social",
  "messaging",
]);

export const ContactPointProviderSchema = z.enum([
  "email",
  "linkedin",
  "github",
  "whatsapp",
  "twitter",
  "dribbble",
  "telegram",
  "calendly",
]);

const ContactPointWritableFields = {
  type: ContactPointTypeSchema,
  provider: ContactPointProviderSchema,
  label: z.string().min(1),
  icon: z.string().min(1),
  identifier: z.string().min(1),
  href: z.string().min(1),
  value: z.string().min(1),
  visible: z.boolean().default(true),
  sortOrder: z.number().int().nonnegative().default(0),
};

export const ContactPointResponseSchema = z.object({
  id: z.number().int().positive(),
  ...ContactPointWritableFields,
});

export const ContactPointsResponseSchema = z.array(ContactPointResponseSchema);

export const PublicContactPointResponseSchema = z.object({
  type: ContactPointTypeSchema,
  provider: ContactPointProviderSchema,
  label: z.string(),
  icon: z.string(),
  href: z.string(),
  value: z.string(),
});

export const PublicContactPointsResponseSchema = z.array(
  PublicContactPointResponseSchema
);

export const CreateContactPointRequestSchema = z.object(
  ContactPointWritableFields
);

export const UpdateContactPointRequestSchema = z
  .object({
    type: ContactPointTypeSchema.optional(),
    provider: ContactPointProviderSchema.optional(),
    label: z.string().min(1).optional(),
    icon: z.string().min(1).optional(),
    identifier: z.string().min(1).optional(),
    href: z.string().min(1).optional(),
    value: z.string().min(1).optional(),
    visible: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type ContactPointType = z.infer<typeof ContactPointTypeSchema>;
export type ContactPointProvider = z.infer<typeof ContactPointProviderSchema>;
export type ContactPointResponse = z.infer<typeof ContactPointResponseSchema>;
export type ContactPointsResponse = z.infer<typeof ContactPointsResponseSchema>;
export type PublicContactPointResponse = z.infer<
  typeof PublicContactPointResponseSchema
>;
export type PublicContactPointsResponse = z.infer<
  typeof PublicContactPointsResponseSchema
>;
export type CreateContactPointRequest = z.infer<
  typeof CreateContactPointRequestSchema
>;
export type UpdateContactPointRequest = z.infer<
  typeof UpdateContactPointRequestSchema
>;
