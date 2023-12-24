"use client";

import { useState } from "react";
import MenuButton from "@/atoms/buttons/menu-button";
import Menu from "@/organisms/layout/menu";
import ResponsiveMenu from "@/organisms/layout/responsive-menu";
import Logo from "@/molecules/layout/logo";

import TwitterIcon from "@/atoms/icons/twitter-icon";
import LinkedInIcon from "@/atoms/icons/linked-in-icon";
import GithubIcon from "@/atoms/icons/github-icon";
import DribbbleIcon from "@/atoms/icons/dribble-icon";
import PinterestIcon from "@/atoms/icons/pinterest-icon";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  const menuPaths = [
    { href: "/", title: "Home" },
    { href: "/about", title: "About" },
    { href: "/projects", title: "Projects" },
    { href: "/articles", title: "Articles" },
  ];

  const socialNetworkLinks = [
    { href: "https://twitter.com", icon: TwitterIcon },
    { href: "https://linkedin.com", icon: LinkedInIcon },
    {
      href: "https://github.com",
      icon: GithubIcon,
      iconClassName: "bg-light dark:bg-dark rounded-full",
    },
    { href: "https://dribbble.com", icon: DribbbleIcon },
    {
      href: "https://pinterest.com",
      icon: PinterestIcon,
      className: "bg-light",
    },
  ];

  return (
    <header
      className="
        relative
        flex
        items-center
        justify-between
        w-full
        px-32 lg:px-16 md:px-12 sm:px-8
        py-8
        z-10
        font-medium
        dark:text-light
      "
    >
      <MenuButton handleClick={handleClick} isOpen={isOpen} />

      <Menu socialNetworkLinks={socialNetworkLinks} menuPaths={menuPaths} />

      {isOpen ? (
        <ResponsiveMenu
          socialNetworkLinks={socialNetworkLinks}
          menuPaths={menuPaths}
          handleClick={handleClick}
        />
      ) : null}

      <div
        className="
          absolute
          left-[50%]
          top-2
          translate-x-[-50%]
        "
      >
        <Logo className="" props={{}} />
      </div>
    </header>
  );
}
