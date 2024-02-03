import "./styles.css";

import { fetchImageByName } from "@/data/assets";
import Image from "next/image";

import Link from "next/link";

export const HeroImage = async ({ name, size, className, href = "" }) => {
  const image = await fetchImageByName({ string: name });

  return (
    <Link href={href}>
      <Image
        src={image.path}
        alt={image.alt}
        priority={true}
        width={size}
        height={size}
        className={`hero-image ${className}`}
      />
    </Link>
  );
};
