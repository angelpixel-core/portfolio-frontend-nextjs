import type { JobExperiencePersistence } from "../../../domains/job-experience/model/ports";
import { getJobExperiencePersistenceMode } from "../mode";
import memory from "./memory";
import postgres from "./postgres";
import snapshotJson from "./snapshot-json";

export const getJobExperiencePersistence = (): JobExperiencePersistence => {
  const mode = getJobExperiencePersistenceMode();

  if (mode === "memory") return memory;
  if (mode === "snapshot-json") return snapshotJson;
  return postgres;
};

export type { JobExperiencePersistence } from "../../../domains/job-experience/model/ports";
