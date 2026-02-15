"use client";

import "./styles.css";

import clsx from "clsx";
import { usePathname } from "next/navigation";

const ActiveMarkFloating = ({ activePath }) => {
  const pathname = usePathname();

  return (
    <span
      className={clsx("active_mark--floating", {
        "active_mark--full": pathname === activePath,
        "active_mark--none": pathname !== activePath,
      })}
    >
      &nbsp;
    </span>
  );
};

export default ActiveMarkFloating;
