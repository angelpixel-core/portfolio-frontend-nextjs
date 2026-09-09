import { z } from "zod";
import { PublicContactPointsResponseSchema } from "./contact-points";

export const ProfilePublicResponseSchema = z.object({
  id: z.number().int().positive(),
  nickname: z.string(),
  authorName: z.string().optional(),
  biography: z.array(z.string()),
  avatar: z.string(),
  logo: z.string().optional(),
  location: z.string(),
  email: z.string().email(),
  contactPoints: PublicContactPointsResponseSchema,
  resume: z.string().url().optional(),
  heroLink: z.string().url().optional(),
  hireMeLink: z.string().url().optional(),
});

export const ProfilesPublicResponseSchema = z.array(
  ProfilePublicResponseSchema
);

export type ProfilePublicResponse = z.infer<typeof ProfilePublicResponseSchema>;
export type ProfilesPublicResponse = z.infer<
  typeof ProfilesPublicResponseSchema
>;
