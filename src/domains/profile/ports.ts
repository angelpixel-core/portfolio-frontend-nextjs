import type { ProfileModel, ProfilesModel } from "./model/schema";

export interface ProfilePublicPersistence {
  capabilities: { read: true; write: false };
  fetchAll(): Promise<ProfilesModel>;
  fetchById(_id: number): Promise<ProfileModel>;
}
