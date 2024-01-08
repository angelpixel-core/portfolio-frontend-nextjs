import { MainContainer } from "@/hoc/_index";
import { BaseLink } from "@/atoms/links/_index";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>

        <div className="footer-central_message">
          Build With<span className="footer-central_heart-icon">&#9825;</span>
          by &nbsp;
          <BaseLink
            href="https://github.com/angelthunder"
            target="_blank"
            text="AngelThunder"
          />
        </div>

        <BaseLink
          href="https://angelthunder.dev"
          target="_blank"
          text="Say Hello"
        />
      </div>
    </footer>
  );
};
