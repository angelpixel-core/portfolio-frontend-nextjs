export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const BASE_HOST = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_API_HOST
  : "http://localhost";
export const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || 8000;
export const API_VERSION = "v1";

export const BASE_URL = `${BASE_HOST}:${BACKEND_PORT}`;
export const PATH_URL = "site";
export const API_URL = `${BASE_URL}/api/${API_VERSION}/${PATH_URL}`;
