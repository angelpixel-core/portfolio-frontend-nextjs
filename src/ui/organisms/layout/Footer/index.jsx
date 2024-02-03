import "./styles.css";

// TODO: Check why don't need it anymore
// import { MainContainer } from "@/atoms/hocs/_index";
import { Author, CopyEmail, Copyright, WhatsApp } from "@/molecules/_index";
import { Chat } from "@/organisms/layout/_index";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Copyright />
        <Author />
        <Chat />
        <WhatsApp />
        <CopyEmail />
      </div>
    </footer>
  );
}
