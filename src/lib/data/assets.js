import { promises as fs } from "fs";

import heroImage from "@/images/profile/hero.png";
import profileImage from "@/images/profile/me.jpg";
const imageFiles = [
  {
    name: "hero",
    url: heroImage,
  },
  {
    name: "profile",
    url: profileImage,
  },
];

export async function fetchImageByName({ string }) {
  try {
    const filename = `${process.cwd()}/src/lib/data/assets.json`;
    const file = await fs.readFile(filename, "utf8");
    const images = JSON.parse(file);

    let image = await images.find(({ name }) => name === string);
    image["path"] = imageFiles.find(({ name }) => name === string).url;

    return image;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch ${string} Image.`);
  }
}
