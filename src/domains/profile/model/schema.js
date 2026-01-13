import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  biography: z.array(z.string()),
  avatar: z.string(),
  location: z.string(),
  email: z.string().email(),
  calendly: z.string().url().optional(),
  telegram: z.string().url().optional(),
});

export const ProfilesSchema = z.array(ProfileSchema);