import { fetchData } from "@/lib/apiService";

async function all() {
  return await fetchData("navigation/nav-links");
}

export const Feature = {
  all,
};
