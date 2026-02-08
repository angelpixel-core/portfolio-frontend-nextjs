import "./styles.css";

import Link from "next/link";

import { ArrowIcon } from "@/atoms/icons";

interface ArrowButtonProps {
  href: string;
  text: string;
  target?: "_blank" | "_self";
}

const ArrowButton = ({ href, text, target = "_blank" }: ArrowButtonProps) => {
  return (
    <Link
      href={href}
      target={target}
      className="arrow-link focus-ring"
      download={target === "_self"}
      aria-label={text}
      title={text}
    >
      {text}
      <ArrowIcon className="arrow-icon" />
    </Link>
  );
};

export default ArrowButton;
