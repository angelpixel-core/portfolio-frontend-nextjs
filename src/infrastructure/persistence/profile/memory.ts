import { memoryStore } from "../../../db/memory-store";
import type { ProfilePublicPersistence } from "../../../domains/profile/ports";
import { ProfilesSchema } from "../../../domains/profile/model/schema";

const memory: ProfilePublicPersistence = {
  capabilities: { read: true, write: false },
  async fetchAll() {
    return ProfilesSchema.parse(memoryStore.getProfiles());
  },
  async fetchById(id) {
    const profile = (await this.fetchAll()).find((item) => item.id === id);
    if (!profile) throw new Error("Profile not found");
    return profile;
  },
};

export default memory;
