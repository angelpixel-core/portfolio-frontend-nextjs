import "./styles.css";

import Image from "next/image";

import lightBulb from "@/images/home/miscellaneous-icons-1.svg";

export const LightBulbImage = () => {
  const imageAlt = "AngelThunder";

  return (
    <div className="ligth-bulb_image-container">
      <Image src={lightBulb} alt={imageAlt} className="light-bulb_image" />
    </div>
  );
};
