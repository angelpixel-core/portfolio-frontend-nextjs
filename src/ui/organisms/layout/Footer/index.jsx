import "./styles.css";

// TODO: Check why don't need it anymore
// import { MainContainer } from "@/hoc/_index";
import { AuthorLink, CopyLink, WhatsAppLink } from "@/atoms/links/_index";

export const Footer = () => {
  const profile = {
    brand: "Angel Szymczak",
    email: "angel.szymczak@hotmail.com",
    github: "https://linkedin.com/in/angelszymczak",
    whatsapp: "https://api.whatsapp.com/send?phone=5491125839761",
    year: 2024,
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer_author-rights">
          {profile.year} &copy; All Rights Reserved.
        </span>

        <AuthorLink href={profile.github} text={profile.brand} />

        <WhatsAppLink href={profile.whatsapp} text="say hello" />

        <CopyLink href={`mailto:${profile.email}`} text={`${profile.email}`} />
      </div>
    </footer>
  );
};
