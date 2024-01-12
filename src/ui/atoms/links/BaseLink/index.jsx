import "./styles.css";

import Link from "next/link";

export const BaseLink = ({ href, target, text, className }) => {
  return (
    <Link href={href} target={target} className={`base-link ${className}`}>
      {text}
    </Link>
  );
};
