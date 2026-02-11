"use client";

import "./styles.css";

import clsx from "clsx";

import useMenuPanel from "@/state/slices/menuPanel/hooks";

interface MenuTickProps {
  className: string;
}

const MenuTick = ({ className }: MenuTickProps) => {
  return <span className={`menu_button-tick ${className}`}></span>;
};

interface MenuIconProps {
  isOpen: boolean;
}

const MenuIcon = ({ isOpen }: MenuIconProps) => {
  return (
    <>
      <MenuTick
        className={clsx({
          "rotate-45 translate-y-1": isOpen,
          "-translate-y-0.5": !isOpen,
        })}
      />
      <MenuTick
        className={clsx("my-0.5", {
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

const MenuButton = () => {
  const { isOpen, toggleMenuPanel } = useMenuPanel();

  return (
    <button
      className="menu_button focus-ring"
      onClick={toggleMenuPanel}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
    >
      <MenuIcon isOpen={isOpen} />
    </button>
  );
};

export default MenuButton;
