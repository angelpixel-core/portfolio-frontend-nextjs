import "./styles.css";

import { Author, CopyEmail, Copyright, WhatsApp } from "@/molecules";
import { Chat } from "@/organisms";

const Footer = ({ whatsAppText = "Direct Message!" }) => {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content" data-testid="footer-content">
        {/* Column 1: Copyright & Author */}
        <div className="footer-col footer-col--left">
          <Copyright />
          <Author />
        </div>
        {/* Column 2: Contact actions */}
        <div className="footer-col footer-col--right">
          <Chat />
          <WhatsApp text={whatsAppText} />
          <CopyEmail />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
