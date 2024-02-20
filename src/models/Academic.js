import { jsonData } from "@/lib/utils";

async function all() {
  return await jsonData("academics");
}

async function fetchBy({ email }) {
  try {
    return await all().then((items) => items.filter((i) => i.email === email));
  } catch (error) {
    console.error("Database Error: ", error.message);
  }
}

export const Academic = {
  all,
  fetchBy,
};
