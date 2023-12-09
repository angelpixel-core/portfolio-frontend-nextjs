"use client";

import CustomLink from "@/components/ui/custom-link";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  PinterestIcon,
  TwitterIcon,
} from "@/components/ui/icons";

export default function NavBar() {
  return (
    <header className="w-full px-32 py-8 font-medium flex items-center justify-between">
      <nav>
        <CustomLink href="/" title="Home" className="mr-4" />
        <CustomLink href="/about" title="About" className="mx-4" />
        <CustomLink href="/projects" title="Projects" className="mx-4" />
        <CustomLink href="/articles" title="Articles" className="mx-4" />
      </nav>

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo className="" props={{}} />
      </div>

      <nav className="flex items-center justify-center flex-wrap">
        <Link href="/" target={"_blank"}>
          <TwitterIcon />
        </Link>

        <Link href="/" target={"_blank"}>
          <LinkedInIcon />
        </Link>

        <Link href="/" target={"_blank"}>
          <GithubIcon />
        </Link>

        <Link href="/" target={"_blank"}>
          <DribbbleIcon />
        </Link>

        <Link href="/" target={"_blank"}>
          <PinterestIcon />
        </Link>
      </nav>
    </header>
  );
}
