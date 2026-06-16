export const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";
const resolveApiBaseUrl = (): string => {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST?.trim();
  const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT?.trim();

  if (!apiHost) {
    return "";
  }

  const normalizedHost = apiHost.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(normalizedHost)) {
    const url = new URL(normalizedHost);

    if (backendPort && !url.port) {
      url.port = backendPort;
    }

    return url.origin;
  }

  const protocol = IS_PRODUCTION ? "https" : "http";
  return backendPort
    ? `${protocol}://${normalizedHost}:${backendPort}`
    : `${protocol}://${normalizedHost}`;
};

export const BASE_HOST: string = process.env.NEXT_PUBLIC_API_HOST?.trim() ?? "";
export const BACKEND_PORT: string =
  process.env.NEXT_PUBLIC_BACKEND_PORT?.trim() ?? "";

export const BASE_URL: string = resolveApiBaseUrl();
export const PATH_URL: string = "site";
export const API_URL: string = BASE_URL
  ? `${BASE_URL}/api/${PATH_URL}`
  : `/api/${PATH_URL}`;
