import React from "react";

import "./styles.css";

import Link from "next/link";
import WhatsAppIcon from "@/atoms/icons/WhatsAppIcon";

interface WhatsAppLinkProps {
  href: string;
  target?: string;
  text: string;
  className?: string;
}

const WhatsAppLink = ({
  href,
  target = "_blank",
  text,
  className = "",
}: WhatsAppLinkProps): React.JSX.Element => {
  return (
    <span className="whatsapp-link__container">
      <Link
        href={href}
        target={target}
        className={`whatsapp-link ${className}`}
      >
        {text}
      </Link>

      <Link
        href={href}
        target={target}
        className="whatsapp-link__icon-container"
      >
        <WhatsAppIcon className="whatsapp-link__icon" />
      </Link>
    </span>
  );
};

export default WhatsAppLink;
