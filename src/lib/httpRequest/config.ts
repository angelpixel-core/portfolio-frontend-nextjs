export const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";
export const BASE_HOST: string = IS_PRODUCTION
  ? (process.env.NEXT_PUBLIC_API_HOST as string)
  : "http://localhost";
export const BACKEND_PORT: string =
  process.env.NEXT_PUBLIC_BACKEND_PORT || "8000";
export const API_VERSION: string = "v1";

export const BASE_URL: string = `${BASE_HOST}:${BACKEND_PORT}`;
export const PATH_URL: string = "site";
export const API_URL: string = `${BASE_URL}/api/${API_VERSION}/${PATH_URL}`;
