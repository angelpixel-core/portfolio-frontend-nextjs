import "./styles.css";

import { Author, CopyEmail, Copyright, WhatsApp } from "@/molecules";
import { Chat } from "@/organisms";

const Footer = ({ whatsAppText = "Direct Message!" }) => {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content" data-testid="footer-content">
        <Copyright />
        <Author />
        <Chat />
        <WhatsApp text={whatsAppText} />
        <CopyEmail />
      </div>
    </footer>
  );
};

export default Footer;
