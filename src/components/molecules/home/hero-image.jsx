import Image from "next/image";

import heroImage from "@/images/profile/hero.png";

export default function HeroImage() {
  return (
    <Image
      src={heroImage}
      alt="AngelThunder"
      className="
        md:inline-block
        w-full md:w-full
        h-auto
        rounded-full
        p-2
      "
      priority

      sizes="
        (max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        50vw
      "
    />
  );
}
