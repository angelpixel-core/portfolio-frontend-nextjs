"use client";

import "./styles.css";

import clsx from "clsx";
import { usePathname } from "next/navigation";

const ActiveMark = ({ activePath }) => {
  const pathname = usePathname();

  return (
    <span
      className={clsx("active_mark", {
        "w-full": pathname === activePath,
        "w-0": pathname !== activePath,
      })}
    >
      &nbsp;
    </span>
  );
};

export default ActiveMark;
