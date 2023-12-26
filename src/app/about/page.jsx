import Biography from "@/organisms/about/biography";
import FeaturedBoxShadow from "@/atoms/shadows/featured-box-shadow";
import HeroImage from "@/molecules/home/hero-image";
import Extras from "@/organisms/about/extras";
import Skills from "@/organisms/about/skills";
import Experiences from "@/organisms/about/experiences";
import Academics from "@/organisms/about/academics";

export default async function Page() {
  return (
    <>
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

          <HeroImage name="profile" className="rounded-2xl" sizes="33vw" />
        </div>

        <Extras />
      </div>

      <Skills />
      <Experiences />
      <Academics />
    </>
  );
}
