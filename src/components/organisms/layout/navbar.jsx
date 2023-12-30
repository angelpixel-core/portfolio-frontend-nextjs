"use client";

import { useState } from "react";
import { fetchFeatures } from "@/data/features";
import { fetchSocials } from "@/data/socials";

import MenuButton from "@/atoms/buttons/menu-button";
import Menu from "@/organisms/layout/menu";
import ResponsiveMenu from "@/organisms/layout/responsive-menu";
import Logo from "@/molecules/layout/logo";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  const features = fetchFeatures();
  const socials = fetchSocials();

  return (
    <header className="layout_menu-container">
      <MenuButton handleClick={handleClick} isOpen={isOpen} />
      <Menu socials={socials} features={features} />

      {isOpen ? (
        <ResponsiveMenu
          socials={socials}
          features={features}
          handleClick={handleClick}
        />
      ) : null}

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>
    </header>
  );
}
