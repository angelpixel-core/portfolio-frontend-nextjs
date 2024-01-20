"use client";

import "./styles.css";

import { Suspense } from "react";
import { useSelector } from "react-redux";

import { MenuButton } from "@/atoms/buttons/_index";
import { Logo } from "@/molecules/layout/_index";
import {
  Menu,
  MenuSkeleton,
  MenuResponsive,
  MenuResponsiveSkeleton,
} from "@/organisms/layout/_index";

// Skeleton
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
