import { fetchData } from "@/lib/apiService";

async function all() {
  return await fetchData("portfolio");
}

async function fetchBy({ email }) {
  return await fetchData("portfolio", email);
}

export const Project = {
  all,
  fetchBy,
};
