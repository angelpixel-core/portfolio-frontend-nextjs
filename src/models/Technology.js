import { fetchData } from "@/lib/apiService";

async function all() {
  return await fetchData("technologies");
}

export const Technology = {
  all,
};
