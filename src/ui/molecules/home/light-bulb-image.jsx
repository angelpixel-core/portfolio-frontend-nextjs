import Image from "next/image";

import lightBulb from "@/images/home/miscellaneous-icons-1.svg";

export const LightBulbImage = () => {
  return (
    <div
      className="
        absolute
        inline-block
        md:hidden
        w-24
        right-8
        bottom-8
      "
    >
      <Image src={lightBulb} alt="AngelThunder" className="w-full h-auto" />
    </div>
  );
};
