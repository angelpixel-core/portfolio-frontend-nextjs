import { ProfileSchema, type ProfileModel } from "../model/schema";
import type { ContactPointModel } from "../../contact-point/model/schema";

export const mapProfilePublic = (
  profile: ProfileModel,
  contactPoints: ContactPointModel[] = []
): ProfileModel => {
  const links = new Map(
    contactPoints.map((point) => [point.provider, point.href])
  );

  return ProfileSchema.parse({
    ...profile,
    ...Object.fromEntries(
      [
        "linkedin",
        "github",
        "twitter",
        "dribbble",
        "telegram",
        "whatsapp",
        "calendly",
      ]
        .filter((provider) =>
          links.has(provider as ContactPointModel["provider"])
        )
        .map((provider) => [
          provider,
          links.get(provider as ContactPointModel["provider"]),
        ])
    ),
  });
};
