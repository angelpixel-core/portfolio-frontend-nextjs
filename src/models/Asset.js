import { jsonData } from "@/lib/utils";

import heroImage from "@/images/profile/hero.png";
import profileImage from "@/images/profile/me.svg";

const images = [heroImage, profileImage];

const all = async () =>
  await jsonData("assets").then((items) =>
    items.map((i, idx) => ({ ...i, src: images[idx] }))
  );

async function findBy({ name }) {
  try {
    return await all().then((items) => items.find((i) => i.name === name));
  } catch (error) {
    console.error("Database Error:", error.message);
  }
}

export const Asset = {
  findBy,
};
