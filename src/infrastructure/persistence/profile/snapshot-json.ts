import profiles from "../../../environment-content/profiles.json";
import type { ProfilePublicPersistence } from "../../../domains/profile/ports";
import { ProfilesSchema } from "../../../domains/profile/model/schema";

const parsed = ProfilesSchema.parse(profiles);

const snapshot: ProfilePublicPersistence = {
  capabilities: { read: true, write: false },
  async fetchAll() {
    return parsed;
  },
  async fetchById(id) {
    const profile = parsed.find((item) => item.id === id);
    if (!profile) throw new Error("Profile not found");
    return profile;
  },
};

export default snapshot;
