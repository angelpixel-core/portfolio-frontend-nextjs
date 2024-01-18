import "./styles.css";

import { MainContainer } from "@/hoc/_index";
import { BaseLink } from "@/atoms/links/_index";

export const Footer = () => {
  const profile = {
    brand: "Angel Szymczak",
    email: "angel.szymczak@hotmail.com",
    github: "https://github.com/angelthunder",
    year: 2024,
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <span>{profile.year} &copy; All Rights Reserved.</span>

        <div className="footer-central_message">
          {/*Build With<span className="footer-central_heart-icon">&#9825;</span>*/}
          by &nbsp;
          <BaseLink
            href={profile.github}
            target="_blank"
            text={profile.brand}
          />
        </div>

        <BaseLink
          href={`mailto:${profile.email}`}
          target="_blank"
          text={`${profile.email}`}
        />
      </div>
    </footer>
  );
};
