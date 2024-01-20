import "./styles.css";

import Link from "next/link";

export const BaseLink = ({ href, target = "_blank", text, className }) => {
  return (
    <Link href={href} target={target} className={`base-link ${className}`}>
      {text}
    </Link>
  );
};
