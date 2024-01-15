"use client";

import "./styles.css";

import { Suspense } from "react";
import { useSelector } from "react-redux";

import { MenuButton } from "@/atoms/buttons/_index";
import { Logo } from "@/molecules/layout/_index";
import { Menu, MenuResponsive } from "@/organisms/layout/_index";

import {
  MenuSkeleton,
  MenuResponsiveSkeleton,
} from "@/organisms/shared/skeletons/_index";

import { setIsOpen } from "@/slices/menu/menuSlice";

export const NavBar = () => {
  const { isOpen } = useSelector((state) => state.menu);

  return (
    <header className="layout_navbar-container">
      <MenuButton />

      <Suspense fallback={<MenuSkeleton />}>
        <Menu />
      </Suspense>

      {isOpen ? (
        <Suspense fallback={<MenuResponsiveSkeleton />}>
          <MenuResponsive />
        </Suspense>
      ) : null}

      <div className="layout_logo-container">
        <Logo />
      </div>
    </header>
  );
};
