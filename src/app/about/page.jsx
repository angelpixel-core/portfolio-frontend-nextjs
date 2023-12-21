import Image from "next/image";
import profilePic from "@/images/profile/developer-pic-2.jpg";
import WithContainer from "@/components/hoc/with-container";
import Biography from "@/components/ui/about/biography";
import ExtraInfo from "@/components/ui/about/extra-info";
import FeaturedBoxShadow from "@/components/ui/featured-box-shadow";

export default function Page() {
  return (
    <div className="grid grid-cols-8 gap-16 w-full">
      <div className="col-span-3 flex flex-col items-start justify-start">
        <Biography />
      </div>

      <div
        className="col-span-3 relative h-max rounded-2xl border-2 border-solid
        p-8 border-dark dark:border-light bg-light dark:bg-dark"
      >
        <FeaturedBoxShadow />

        <Image
          src={profilePic}
          alt="AngelThunder"
          className="w-full h-auto rounded-2xl"
        />
      </div>

      <div className="col-span-2 flex flex-col items-end justify-between">
        <ExtraInfo number={50} subtitle={"satisfied customers"} />
        <ExtraInfo number={40} subtitle={"projects completed"} />
        <ExtraInfo number={4} subtitle={"years of experience"} />
      </div>
    </div>
  );
}
