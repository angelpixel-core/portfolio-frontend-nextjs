import "./styles.css";

import Link from "next/link";
import { WhatsAppIcon } from "@/icons";

const WhatsAppLink = ({ href, target = "_blank", text, className = "" }) => {
  return (
    <span className="whatsapp-link_container">
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
        className="whatsapp-link_icon-container"
      >
        <WhatsAppIcon className="whatsapp-link_icon" />
      </Link>
    </span>
  );
};

export default WhatsAppLink;
