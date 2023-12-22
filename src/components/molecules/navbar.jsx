"use client";

import CustomLink from "@/components/ui/custom-link";
import CustomMobileLink from "@/components/ui/custom-mobile-link";
import Logo from "@/components/ui/logo";
import SocialNetworkLink from "@/components/ui/social-network-link";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  PinterestIcon,
  TwitterIcon,
  MoonIcon,
  SunIcon,
} from "@/components/ui/icons";
import MenuButton from "@/components/ui/menu-button";
import useThemeSwitcher from "@/hooks/use-theme-switcher";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const DARK = "dark";
const LIGHT = "light";

export default function NavBar() {
  const [mode, setMode] = useThemeSwitcher();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <header
      className="w-full flex items-center justify-between font-medium px-32 py-8
      dark:text-light relative z-10 lg:px-16 md:px-12 sm:px-8"
    >
      <MenuButton handleClick={handleClick} isOpen={isOpen} />

      <div className="w-full flex justify-between items-center lg:hidden">
        <nav>
          <CustomLink href="/" title="Home" className="mr-4" />
          <CustomLink href="/about" title="About" className="mx-4" />
          <CustomLink href="/projects" title="Projects" className="mx-4" />
          <CustomLink href="/articles" title="Articles" className="mx-4" />
        </nav>

        <nav className="flex items-center justify-center flex-wrap">
          <SocialNetworkLink
            href="https://twitter.com"
            className="w-6 mr-3 sm:mx-1"
          >
            <TwitterIcon />
          </SocialNetworkLink>

          <SocialNetworkLink
            href="https://linkedin.com"
            className="w-6 mx-3 sm:mx-1"
          >
            <LinkedInIcon />
          </SocialNetworkLink>

          <SocialNetworkLink
            href="https://github.com"
            className="w-6 mx-3 sm:mx-1"
          >
            <GithubIcon />
          </SocialNetworkLink>

          <SocialNetworkLink
            href="https://dribbble.com"
            className="w-6 mx-3 sm:mx-1"
          >
            <DribbbleIcon />
          </SocialNetworkLink>

          <SocialNetworkLink
            href="https://pinterest.com"
            className="w-6 mx-3 sm:mx-1"
          >
            <PinterestIcon />
          </SocialNetworkLink>

          <button
            onClick={() => setMode(mode === LIGHT ? DARK : LIGHT)}
            className={clsx(
              "flex items-center justify-center rounded-full p-1 ml-3 sm:ml-1",
              {
                "bg-dark text-light": mode === LIGHT,
                "bg-light text-dark": mode !== LIGHT,
              },
            )}
          >
            {mode === DARK ? (
              <MoonIcon className={"fill-dark"} />
            ) : (
              <SunIcon className={"fill-dark"} />
            )}
          </button>
        </nav>
      </div>

      {isOpen ? (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-w-[70vw] flex flex-col justify-between z-30 items-center
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark/90
          dark:bg-light/75 rounded-lg backdrop-blur-md py-32 hidden lg:flex"
        >
          <nav
            className="flex items-center flex-col justify-center gap-1 my-2
            text-light dark:text-dark"
          >
            <CustomMobileLink
              href="/"
              title="Home"
              toggle={handleClick}
              className="my-2"
            />
            <CustomMobileLink
              href="/about"
              title="About"
              toggle={handleClick}
              className="my-2"
            />
            <CustomMobileLink
              href="/projects"
              title="Projects"
              toggle={handleClick}
              className="my-2"
            />
            <CustomMobileLink
              href="/articles"
              title="Articles"
              toggle={handleClick}
              className="my-2"
            />
          </nav>

          <nav className="flex items-center justify-center flex-wrap">
            <SocialNetworkLink href="https://twitter.com" className="w-6 mr-3">
              <TwitterIcon />
            </SocialNetworkLink>

            <SocialNetworkLink href="https://linkedin.com" className="w-6 mx-3">
              <LinkedInIcon />
            </SocialNetworkLink>

            <SocialNetworkLink href="https://github.com" className="w-6 mx-3">
              <GithubIcon className={`bg-light dark:bg-dark rounded-full`} />
            </SocialNetworkLink>

            <SocialNetworkLink href="https://dribbble.com" className="w-6 mx-3">
              <DribbbleIcon />
            </SocialNetworkLink>

            <SocialNetworkLink
              href="https://pinterest.com"
              className="w-6 mx-3 bg-light"
            >
              <PinterestIcon />
            </SocialNetworkLink>

            <button
              onClick={() => setMode(mode === LIGHT ? DARK : LIGHT)}
              className="ml-3 flex items-center justify-center rounded-full p-1
                 bg-dark text-light dark:bg-light dark:text-dark"
            >
              {mode === DARK ? (
                <MoonIcon className={"fill-dark"} />
              ) : (
                <SunIcon className={"fill-dark"} />
              )}
            </button>
          </nav>
        </motion.div>
      ) : null}

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo className="" props={{}} />
      </div>
    </header>
  );
}
