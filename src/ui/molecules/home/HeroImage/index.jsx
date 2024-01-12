import "./styles.css";

import { fetchImageByName } from "@/data/assets";
import Image from "next/image";

export const HeroImage = async ({ name, size, className }) => {
  const image = await fetchImageByName({ string: name });

  return (
    <Image
      src={image.path}
      alt={image.alt}
      priority
      sizes={`
        (max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        ${size}
      `}
      className={`hero-image ${className}`}
    />
  );
};
