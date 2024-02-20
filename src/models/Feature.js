import { jsonData } from "@/lib/utils";

const all = async () => await jsonData("features");

async function fetchBy({ enabled }) {
  try {
    return await all().then((items) =>
      items.filter((i) => i.enabled === enabled)
    );
  } catch (error) {
    console.error("Database Error:", error.message);
  }
}

export const Feature = {
  fetchBy,
};
