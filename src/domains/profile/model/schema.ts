import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  authorName: z.string().optional(),
  biography: z.array(z.string()),
  avatar: z.string(),
  logo: z.string().optional(),
  location: z.string(),
  email: z.string().email(),

  // Social URLs
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
  dribbble: z.string().url().optional(),
  telegram: z.string().url().optional(),
  whatsapp: z.string().url().optional(),
  calendly: z.string().url().optional(),

  // Action URLs
  resume: z.string().optional(),
  heroLink: z.string().url().optional(),
  hireMeLink: z.string().url().optional(),
});

export const ProfilesSchema = z.array(ProfileSchema);

// Inferred types from Zod schemas
export type ProfileModel = z.infer<typeof ProfileSchema>;
export type ProfilesModel = z.infer<typeof ProfilesSchema>;
