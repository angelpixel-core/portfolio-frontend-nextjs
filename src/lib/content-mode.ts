const STATIC_CONTENT_MODE = "static-json";
const DEFAULT_CONTENT_MODE = "db";

const normalizeMode = (value: string | undefined): string => {
  return (value ?? "").trim().toLowerCase();
};

export const getContentMode = (): string => {
  const publicMode = normalizeMode(process.env.NEXT_PUBLIC_CONTENT_MODE);
  if (publicMode) return publicMode;

  const serverMode = normalizeMode(process.env.CONTENT_MODE);
  if (serverMode) return serverMode;

  return DEFAULT_CONTENT_MODE;
};

export const isStaticContentMode = (): boolean => {
  return getContentMode() === STATIC_CONTENT_MODE;
};

export const getStaticContentModeReason = (): string => {
  return "Static content mode is enabled; writes are disabled.";
};
