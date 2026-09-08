import type { ProfilePublicPersistence } from "../../../domains/profile/ports";
import { getJobExperiencePersistenceMode } from "../mode";
import memory from "./memory";
import postgres from "./postgres";
import snapshot from "./snapshot-json";

export const getProfilePublicPersistence = (): ProfilePublicPersistence => {
  const mode = getJobExperiencePersistenceMode();
  if (mode === "memory") return memory;
  if (mode === "snapshot-json") return snapshot;
  return postgres;
};
