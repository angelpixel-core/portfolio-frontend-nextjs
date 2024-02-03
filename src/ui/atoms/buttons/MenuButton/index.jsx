"use client";

import "./styles.css";

import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";

import { toggleMenu } from "@/slices/menu/menuSlice";

const MenuTick = ({ className }) => {
  return <span className={`menu_button-tick ${className}`}></span>;
};

const MenuIcon = ({ isOpen }) => {
  return (
    <>
      <MenuTick
        className={clsx({
          "rotate-45 translate-y-1": isOpen,
          "-translate-y-0.5": !isOpen,
        })}
      />
      <MenuTick
        className={clsx(`my-0.5`, {
          "opacity-0": isOpen,
          "opacity-100": !isOpen,
        })}
      />
      <MenuTick
        className={clsx({
          "-rotate-45 -translate-y-1": isOpen,
          "translate-y-0.5": !isOpen,
        })}
      />
    </>
  );
};

export function MenuButton() {
  const dispatch = useDispatch();
  const { isMenuOpen } = useSelector((state) => state.menu);

  return (
    <button className="menu_button" onClick={() => dispatch(toggleMenu())}>
      <MenuIcon isOpen={isMenuOpen} />
    </button>
  );
}
