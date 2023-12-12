import Image from "next/image";
import profilePic from "../../../public/images/profile/developer-pic-2.jpg";
import WithContainer from "@/components/HOCs/with-container";
import ExtraInfo from "@/components/ui/about/extra-info";

export default function Page() {
  return (
    <div className="grid w-full grid-cols-8 gap-16">
      <div className="col-span-3 flex flex-col items-start justify-start">
        <h2 className="mb-4 text-lg font-bold uppercase text-dark/75">
          Biography
        </h2>
        <p className="font-medium">
          {`
              Hi, I'm CodeBucks, a web developer and UI/UX designer with a
              passion for creating beautiful, functional, and user-centered
              digital experiences. With 4 years of experience in the field. I am
              always looking for new and innovative ways to bring my clients'
              visions to life.
          `}
        </p>
        <p className="font-medium">
          {`
             I believe that design is about more than just making things look 
             pretty.
          `}
        </p>

        <p className="font-medium">
          {`
              it's about solving problems and creating intuitive,
              enjoyable experiences for users.
          `}
        </p>
        <p className="font-medium">
          {`
              Whether I'm working on a website, mobile app, or other digital
              product, I bring my commitment to design excellence and
              user-centered thinking to every project I work on. I look forward
              to the opportunity to bring my skills and passion to your next
              project.
          `}
        </p>
      </div>

      <div
        className="col-span-3 relative h-max rounded-2xl border-2 border-solid
        border-dark bg-light p-8"
      >
        <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark" />

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
