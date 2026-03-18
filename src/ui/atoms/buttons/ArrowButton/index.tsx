import "./styles.css";

import Link from "next/link";
import type { MouseEventHandler } from "react";

import ArrowIcon from "@/atoms/icons/ArrowIcon";

interface ArrowButtonProps {
  href: string;
  text: string;
  target?: "_blank" | "_self";
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const ArrowButton = ({
  href,
  text,
  target = "_blank",
  onClick,
}: ArrowButtonProps) => {
  return (
    <Link
      href={href}
      target={target}
      className="arrow-link focus-ring"
      download={target === "_self"}
      aria-label={text}
      title={text}
      onClick={onClick}
    >
      {text}
      <ArrowIcon className="arrow-icon" />
    </Link>
  );
};

export default ArrowButton;
