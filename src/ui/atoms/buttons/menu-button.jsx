"use client";

import { useSelector, useDispatch } from "react-redux";
import { toggleMenu } from "@/slices/menu/menuSlice";
import clsx from "clsx";

const ButtonTick = ({ className }) => {
  return <span className={`menu_button-tick ${className}`}></span>;
};

export const MenuButton = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.menu);

  return (
    <button className="menu_button" onClick={() => dispatch(toggleMenu())}>
      <ButtonTick
        className={clsx({
          "rotate-45 translate-y-1": isOpen,
          "-translate-y-0.5": !isOpen,
        })}
      />
      <ButtonTick
        className={clsx(`my-0.5`, {
          "opacity-0": isOpen,
          "opacity-100": !isOpen,
        })}
      />
      <ButtonTick
        className={clsx({
          "-rotate-45 -translate-y-1": isOpen,
          "translate-y-0.5": !isOpen,
        })}
      />
    </button>
  );
};
