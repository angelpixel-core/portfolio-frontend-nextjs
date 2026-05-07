export type DbDriver = "postgres" | "memory";

const normalizeDriver = (value?: string): DbDriver | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "memory") return "memory";
  if (normalized === "postgres") return "postgres";
  return null;
};

export const getDbDriver = (): DbDriver => {
  const explicit = normalizeDriver(process.env.DB_DRIVER);
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "test") return "memory";
  return "postgres";
};

export const isMemoryDriver = (): boolean => getDbDriver() === "memory";
