import React from "react";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

import "./styles.css";

import CopyEmail from "@/molecules/CopyEmail";
import Copyright from "@/molecules/Copyright";
import Telegram from "@/molecules/Telegram";
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import { getSocialUrl } from "@/lib/social-urls";

interface FooterLinkItemProps {
  href?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

const FooterLinkItem = ({ href, icon: Icon, label }: FooterLinkItemProps) => {
  if (!href) {
    return (
      <span className="footer-link footer-link--disabled" aria-disabled="true">
        <Icon className="footer-link__icon" aria-hidden="true" />
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
      aria-label={label}
    >
      <Icon className="footer-link__icon" aria-hidden="true" />
      {label}
    </Link>
  );
};

const Footer = (): React.JSX.Element => {
  const githubUrl = getSocialUrl("github") || undefined;
  const linkedinUrl = getSocialUrl("linkedin") || undefined;

  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content" data-testid="footer-content">
        <div className="footer-primary">
          <section className="footer-group footer-group--copyright">
            <Copyright />
          </section>

          <section className="footer-group footer-group--contact">
            <h3 className="footer-group__title">Contact</h3>
            <Telegram />
            <CopyEmail />
          </section>

          <section className="footer-group footer-group--links">
            <h3 className="footer-group__title">Links</h3>
            <FooterLinkItem href={githubUrl} icon={GitHubIcon} label="GitHub" />
            <FooterLinkItem
              href={linkedinUrl}
              icon={LinkedInIcon}
              label="LinkedIn"
            />
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
