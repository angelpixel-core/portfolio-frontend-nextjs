import React from "react";

import "./styles.css";

import Author from "@/molecules/Author";
import CopyEmail from "@/molecules/CopyEmail";
import Copyright from "@/molecules/Copyright";
import WhatsApp from "@/molecules/WhatsApp";
import FooterChatColumn from "./FooterChatColumn";

interface FooterProps {
  whatsAppText?: string;
}

const Footer = ({
  whatsAppText = "Direct Message!",
}: FooterProps): React.JSX.Element => {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content" data-testid="footer-content">
        {/* Column 1: Copyright & Author */}
        <div className="footer-col footer-col--left">
          <Copyright />
          <Author />
        </div>
        {/* Column 2: Chat */}
        <div className="footer-col footer-col--center">
          <FooterChatColumn />
        </div>
        {/* Column 3: WhatsApp & Email */}
        <div className="footer-col footer-col--right">
          <WhatsApp text={whatsAppText} />
          <CopyEmail />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
