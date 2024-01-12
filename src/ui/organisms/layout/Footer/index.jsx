import "./styles.css";

import { MainContainer } from "@/hoc/_index";
import { BaseLink } from "@/atoms/links/_index";

export const Footer = () => {
  const repo = {
    url: "https://github.com/angelthunder",
    text: "AngelThunder",
  };
  const web = { url: "https://angelthunder.dev", text: "Say Hello" };

  return (
    <footer className="footer">
      <div className="footer-content">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>

        <div className="footer-central_message">
          Build With<span className="footer-central_heart-icon">&#9825;</span>
          by &nbsp;
          <BaseLink href={repo.url} target="_blank" text={repo.text} />
        </div>

        <BaseLink href={web.url} target="_blank" text={web.text} />
      </div>
    </footer>
  );
};
