"use client";

import "./styles.css";

import clsx from "clsx";
import { usePathname } from "next/navigation";

export function ActiveMarkFloating({ activePath }) {
  const pathname = usePathname();

  return (
    <span
      className={clsx("active_mark--floating", {
        "w-full": pathname === activePath,
        "w-0": pathname !== activePath,
      })}
    >
      &nbsp;
    </span>
  );
}
