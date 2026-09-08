export type PersistenceMode = "postgres" | "snapshot-json" | "memory";

const normalizeMode = (value: string | undefined): string => {
  return (value ?? "").trim().toLowerCase();
};

export const getJobExperiencePersistenceMode = (): PersistenceMode => {
  const explicit = normalizeMode(process.env.JOB_EXPERIENCE_PERSISTENCE_MODE);
  if (
    explicit === "postgres" ||
    explicit === "snapshot-json" ||
    explicit === "memory"
  ) {
    return explicit;
  }

  const generic = normalizeMode(process.env.PERSISTENCE_MODE);
  if (
    generic === "postgres" ||
    generic === "snapshot-json" ||
    generic === "memory"
  ) {
    return generic;
  }

  if (
    process.env.NEXT_PUBLIC_CONTENT_MODE?.trim().toLowerCase() === "static-json"
  ) {
    return "snapshot-json";
  }

  if (process.env.DB_DRIVER?.trim().toLowerCase() === "memory") {
    return "memory";
  }

  if (process.env.NODE_ENV === "test") {
    return "memory";
  }

  return "postgres";
};
