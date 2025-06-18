import "./styles.css";

// TODO: Check why don't need it anymore
// import { MainContainer } from "@/atoms/hocs";
import { Author, CopyEmail, Copyright, WhatsApp } from "@/molecules";
import { Chat } from "@/organisms/layout";

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
