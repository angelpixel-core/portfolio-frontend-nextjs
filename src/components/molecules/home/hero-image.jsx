import Image from "next/image";

import { fetchImageByName } from "@/data/assets";

export default async function HeroImage({ name, size, className }) {
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
      className={`
        w-full
        h-auto
        ${className}
      `}
    />
  );
}
