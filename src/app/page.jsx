import Image from "next/image";

import profilePic from "../../public/images/profile/developer-pic-1.png";

export default function Home() {
  return (
    <main className="flex items-center text-dark w-full min-h-screen">
      <div className="w-full h-full inline-block z-0 bg-light p-32 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="w-1/2">
            <Image
              src={profilePic}
              alt="AngelThunder"
              className="w-full h-auto rounded-full p-2"
            />
          </div>

          <div className="w-1/2 flex flex-col items-center self-center p-2">
            {/* SloganText */}

            {/* Description */}
          </div>
        </div>
      </div>
    </main>
  );
}
