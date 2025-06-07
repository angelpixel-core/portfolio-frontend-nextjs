// src/lib/apiService.js
const BACKEND_PORT = process.env.BACKEND_PORT || 3000; // Default to 3000 if not set
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function fetchData(resource) {
  // In a real scenario, IS_PRODUCTION would determine the base URL.
  // For this example, we'll always use the local mock API.
  // Later, this can be changed to:
  // const baseUrl = IS_PRODUCTION ? `http://your-production-api.com` : `http://localhost:${BACKEND_PORT}`;
  // const url = `${baseUrl}/${resource}`;

  const url = `/api/${resource}.json`; // Using .json extension for mock files

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API Error for resource ${resource}: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status} for resource ${resource}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch resource ${resource}:`, error);
    // Return empty array or handle error as appropriate for your application
    return [];
  }
}
