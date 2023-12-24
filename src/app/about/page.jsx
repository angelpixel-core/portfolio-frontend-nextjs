import Biography from "@/organisms/about/biography";
import FeaturedBoxShadow from "@/atoms/shadows/featured-box-shadow";
import Image from "next/image";
import profilePic from "@/images/profile/me.jpg";
import Extras from "@/organisms/about/extras";

export default function Page() {
  const extras = [
    { number: 50, subtitle: "satisfied customers" },
    { number: 40, subtitle: "projects completed" },
    { number: 4, subtitle: "years of experience" },
  ];

  return (
    <div
      className="
        w-full
        grid grid-cols-8
        gap-16 sm:gap-8
      "
    >
      <div
        className="
          flex flex-col
          items-start justify-start
          col-span-3 xl:col-span-4 md:col-span-8
          gap-4
          md:order-2 
        "
      >
        <Biography />
      </div>

      <div
        className="
          relative
          h-max
          border-2 border-solid
          border-dark dark:border-light
          bg-light dark:bg-dark
          col-span-3 xl:col-span-4 md:col-span-8
          p-8
          rounded-2xl
          md:order-1
        "
      >
        <FeaturedBoxShadow />

        <Image
          src={profilePic}
          alt="AngelThunder"
          className="w-full h-auto rounded-2xl"
          priority
          sizes="
            (max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw
          "
        />
      </div>

      <Extras extras={extras} />
    </div>
  );
}
