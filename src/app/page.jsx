"use client";

import Image from "next/image";
import AnimatedText from "@/components/ui/animated-text";
import Link from "next/link";
import { LinkArrow } from "@/components/ui/icons";

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
            <AnimatedText
              text="Turning Vision Into Reality With Code And Design."
              className="!text-6xl !text-left"
            />

            <p className="my-4 text-base font-medium">
              As a skilled full-stack developer, I am dedicated to turning ideas
              into innovative web applications. Explore my latest projects and
              articles, showcasing my expertise in React.js and web development.
            </p>

            <div className="flex items-cemter self-start mt-2">
              <Link
                href="/resume.pdf"
                target={"_blank"}
                className="flex items-center bg-dark text-light p-2.5 px-6
                rounded-lg text-lg font-semibold hover:bg-light hover:text-dark
                border-2 border-solid border-transparent hover:border-dark"
                download={true}
              >
                Resume <LinkArrow className={"w-6 ml-1"} />
              </Link>
              <Link href="mailto:angelthunder@mail.com" target={"_blank"}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
