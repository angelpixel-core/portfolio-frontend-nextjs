import Image from "next/image";
import profilePic from "@/images/profile/developer-pic-2.jpg";
import Biography from "@/components/ui/about/biography";
import ExtraInfo from "@/components/ui/about/extra-info";
import FeaturedBoxShadow from "@/components/ui/featured-box-shadow";

import TransitionEffect from "@/components/ui/transition-effect";

export default function Page() {
  return (
    <>
      <TransitionEffect />
      <div className="w-full grid grid-cols-8 gap-16 sm:gap-8">
        <div
          className="flex flex-col items-start justify-start gap-4
        col-span-3 xl:col-span-4 md:order-2 md:col-span-8"
        >
          <Biography />
        </div>

        <div
          className="relative h-max rounded-2xl p-8
        border-2 border-solid border-dark dark:border-light bg-light dark:bg-dark
        col-span-3 xl:col-span-4 md:order-1 md:col-span-8"
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

        <div
          className="flex flex-col xl:flex-row justify-between
        items-end xl:items-center
        col-span-2 xl:col-span-8
        md:order-3"
        >
          <ExtraInfo number={50} subtitle={"satisfied customers"} />
          <ExtraInfo number={40} subtitle={"projects completed"} />
          <ExtraInfo number={4} subtitle={"years of experience"} />
        </div>
      </div>
    </>
  );
}
