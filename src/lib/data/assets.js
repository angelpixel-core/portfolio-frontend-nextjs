import heroImage from "@/images/profile/hero.png";
import profileImage from "@/images/profile/me.svg";

const images = [
  {
    name: "hero",
    alt: "Angel Thunder HERO",
    path: heroImage,
  },
  {
    name: "profile",
    alt: "Angel Thunder PROFILE",
    path: profileImage,
  },
];

export const fetchImageByName = async ({ string }) => {
  try {
    return await images.find(({ name }) => name === string);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch ${string} Image.`);
  }
};
