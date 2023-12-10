"use client";

import CustomLink from "@/components/ui/custom-link";
import Logo from "@/components/ui/logo";
import SocialNetworkLink from "@/components/ui/social-network-link";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  PinterestIcon,
  TwitterIcon,
} from "@/components/ui/icons";

import { motion } from "framer-motion";

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
        <SocialNetworkLink href="https://twitter.com" className="w-6 mr-3">
          <TwitterIcon />
        </SocialNetworkLink>

        <SocialNetworkLink href="https://linkedin.com" className="w-6 mx-3">
          <LinkedInIcon />
        </SocialNetworkLink>

        <SocialNetworkLink href="https://github.com" className="w-6 mx-3">
          {" "}
          <GithubIcon />
        </SocialNetworkLink>

        <SocialNetworkLink href="https://dribbble.com" className="w-6 mx-3">
          <DribbbleIcon />
        </SocialNetworkLink>

        <SocialNetworkLink href="https://pinterest.com" className="w-6 mx-3">
          <PinterestIcon />
        </SocialNetworkLink>
      </nav>
    </header>
  );
}
