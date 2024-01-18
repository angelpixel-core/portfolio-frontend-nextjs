"use client";

import "./styles.css";

import { Suspense } from "react";
import { useSelector } from "react-redux";

import { MenuButton } from "@/atoms/buttons/_index";
import { Logo } from "@/molecules/layout/_index";
import { Menu, MenuResponsive } from "@/organisms/layout/_index";

import { MenuSkeleton } from "@/organisms/layout/Menu/skeletons";

import { setIsOpen } from "@/slices/menu/menuSlice";

export const NavBar = () => {
  const { isOpen } = useSelector((state) => state.menu);

  return (
    <header className="layout_navbar-container">
      <MenuButton />

      <Suspense fallback={<MenuSkeleton />}>
        <Menu />
      </Suspense>

      {isOpen ? <MenuResponsive /> : null}

      <div className="layout_logo-container">
        <Logo />
      </div>
    </header>
  );
};
