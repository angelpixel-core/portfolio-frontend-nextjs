import { jsonData } from "@/lib/utils";

const all = async () => await jsonData("academics");

export async function fetchAcademics({ email }) {
  try {
    return await all().then((items) => items.filter((i) => i.email === email));
  } catch (error) {
    console.error("Database Error:", error.message);
  }
}
