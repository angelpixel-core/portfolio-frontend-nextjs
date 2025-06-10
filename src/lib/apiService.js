const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const API_VERSION = "v1";

/**
 * @param {string} resource - e.g. "users" or "posts"
 * @param {object|string|number} [params] - ID o query object
 * @returns {Promise<any>}
 */
export async function fetchData(resource, params) {
  let url;

  const baseUrl = IS_PRODUCTION
    ? "https://your-production"
    : `http://localhost:${BACKEND_PORT}`;
  url = `${baseUrl}/api/${API_VERSION}/${resource}`;

  // Si es un ID
  if (typeof params === "string" || typeof params === "number") {
    url += `/${params}`;
  }

  // Si es un objeto con query
  if (typeof params === "object" && params !== null) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  console.log({ url, resource, params });

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch resource ${resource}:`, error);
    return [];
  }
}

export async function fetchDataLocally(resource) {
  try {
    const res = await fetch(`/public/api/${resource}.json`);

    return await res.json();
  } catch (error) {
    console.error(`Error loading ${resource}.json:`, error);
    return [];
  }
}
