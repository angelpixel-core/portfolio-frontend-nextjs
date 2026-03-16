import { API_URL } from "./config";

export interface HttpRequestOptions {
  token?: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Unified HTTP request utility
 * @param {string} endpoint - Endpoint relative to API_URL (no leading slash)
 * @param {object} options - Fetch options (method, headers, body, token, etc.)
 */
const httpRequest = async (
  endpoint: string,
  api_url: string = API_URL,
  options: HttpRequestOptions = {}
): Promise<unknown> => {
  const url = `${api_url}/${endpoint}`;
  const { token: customToken, method = "GET", body, headers = {} } = options;

  // Optional: try to pull token automatically from localStorage
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const token = customToken || storedToken;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined && body !== null
      ? { body: JSON.stringify(body) }
      : {}),
  };

  const response = await fetch(url, config);

  // ✅ Solo leemos el body una vez
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  // ✅ Solo retornamos JSON una vez
  return await response.json();

  // if (!response.ok) {
  //   let errorBody;
  //   try {
  //     errorBody = await response.json();
  //   } catch {
  //     errorBody = await response.text();
  //   }
  //
  //   const error = new Error(
  //     `🔴 HTTP ${response.status}: ${response.statusText}`
  //   );
  //   error.status = response.status;
  //   error.body = errorBody;
  //   throw error;
  // }
  //
  // const contentType = response.headers.get("content-type");
  // return contentType?.includes("application/json")
  //   ? response.json()
  //   : response.text();
};

export default httpRequest;
