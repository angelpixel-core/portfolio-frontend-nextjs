import React from "react";

import "./styles.css";

import Link from "next/link";

interface BaseLinkProps {
  href: string;
  target?: string;
  text: string;
  className: string;
}

const BaseLink = ({
  href,
  target = "_blank",
  text,
  className,
}: BaseLinkProps): React.JSX.Element => {
  return (
    <Link href={href} target={target} className={`base-link ${className}`}>
      {text}
    </Link>
  );
};

export default BaseLink;
