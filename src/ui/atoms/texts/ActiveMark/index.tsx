"use client";

import React from "react";

import "./styles.css";

import clsx from "clsx";
import { usePathname } from "next/navigation";

interface ActiveMarkProps {
  activePath: string;
}

const ActiveMark = ({ activePath }: ActiveMarkProps): React.JSX.Element => {
  const pathname = usePathname();

  return (
    <span
      className={clsx("active__mark", {
        "active__mark--full": pathname === activePath,
        "active__mark--none": pathname !== activePath,
      })}
    >
      &nbsp;
    </span>
  );
};

export default ActiveMark;
