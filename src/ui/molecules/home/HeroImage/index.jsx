import "./styles.css";

import { fetchImageByName } from "@/data/assets";
import Image from "next/image";

export const HeroImage = async ({ name, size, className }) => {
  const image = await fetchImageByName({ string: name });

  return (
    <Image
      src={image.path}
      alt={image.alt}
      priority={true}
      width={size}
      height={size}
      className={`hero-image ${className}`}
    />
  );
};
