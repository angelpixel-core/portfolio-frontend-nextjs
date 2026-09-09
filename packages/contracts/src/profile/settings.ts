import { z } from "zod";

const ProfileSettingsFields = {
  nickname: z.string().min(1),
  authorName: z.string().min(1),
  authorRole: z.string().min(1),
  biography: z.array(z.string()),
  avatar: z.string().min(1),
  logo: z.string().min(1).optional(),
  location: z.string(),
  email: z.string().email(),
  resume: z.string().url().optional(),
  heroLink: z.string().url().optional(),
  hireMeLink: z.string().url().optional(),
};

export const ProfileSettingsResponseSchema = z.object({
  id: z.number().int().positive(),
  ...ProfileSettingsFields,
});

export const UpdateProfileSettingsRequestSchema = z
  .object(ProfileSettingsFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type ProfileSettingsResponse = z.infer<
  typeof ProfileSettingsResponseSchema
>;
export type UpdateProfileSettingsRequest = z.infer<
  typeof UpdateProfileSettingsRequestSchema
>;
