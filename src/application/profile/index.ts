import { getProfilePublicPersistence } from "../../infrastructure/persistence/profile";
import { mapProfilePublic } from "../../domains/profile/public/mapper";

export const fetchPublicProfiles = async () => {
  const profiles = await getProfilePublicPersistence().fetchAll();
  return profiles.map((profile) => mapProfilePublic(profile));
};

export const fetchPublicProfileById = async (id: number) => {
  const profile = await getProfilePublicPersistence().fetchById(id);
  return mapProfilePublic(profile);
};
