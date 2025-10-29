const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BASE_HOST = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_API_HOST
  : `http://localhost`;
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;
const API_VERSION = "v1";

const BASE_URL = `${BASE_HOST}:${BACKEND_PORT}/api/${API_VERSION}`;

const httpRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}/${endpoint}`;
  const { token, ...customOptions } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...customOptions.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(
      `🔴 Fetch error: ${response.status} ${response.statusText}`
    );
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json")
    ? response.json()
    : response.text();
};

export default httpRequest;
