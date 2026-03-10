import React from "react";

import "./styles.css";

import Author from "@/molecules/Author";
import CopyEmail from "@/molecules/CopyEmail";
import Copyright from "@/molecules/Copyright";
import Telegram from "@/molecules/Telegram";

const Footer = (): React.JSX.Element => {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content" data-testid="footer-content">
        <div className="footer-primary">
          <section className="footer-group footer-group--copyright">
            <Copyright />
            <Author />
          </section>

          <section className="footer-group footer-group--contact">
            <h3 className="footer-group__title">Contact</h3>
            <Telegram />
            <CopyEmail />
          </section>

          <section className="footer-group footer-group--links">
            <h3 className="footer-group__title">Links</h3>
            <Author />
          </section>
        </div>

        <section
          className="footer-summary"
          aria-label="Technology stack summary"
        >
          <p>Built with Next.js · React · TypeScript · Tailwind CSS</p>
          <p>State &amp; Data: Redux Toolkit · TanStack Query · Zod</p>
          <p>Motion &amp; UI: Framer Motion · Storybook</p>
          <p>Testing &amp; Accessibility: Playwright · Jest · axe-core</p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
