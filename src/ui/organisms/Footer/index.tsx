import React from "react";

import "./styles.css";

import Author from "@/molecules/Author";
import CopyEmail from "@/molecules/CopyEmail";
import Copyright from "@/molecules/Copyright";
import Telegram from "@/molecules/Telegram";
import FooterChatColumn from "./FooterChatColumn";

const Footer = (): React.JSX.Element => {
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
        {/* Column 3: Telegram & Email */}
        <div className="footer-col footer-col--right">
          <Telegram />
          <CopyEmail />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
