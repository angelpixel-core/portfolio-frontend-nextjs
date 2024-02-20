import { jsonData } from "@/lib/utils";

async function all() {
  return await jsonData("contents");
}

async function findBy({ page }) {
  try {
    return await all().then((items) => items.find((i) => i.page === page));
  } catch (error) {
    console.error("Database Error:", error.message);
  }
}

export const Content = {
  all,
  findBy,
};
