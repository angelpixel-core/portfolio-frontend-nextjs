"use client";

import React from "react";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

import "./styles.css";

import CopyEmail from "@/molecules/CopyEmail";
import Copyright from "@/molecules/Copyright";
import Telegram from "@/molecules/Telegram";
import FooterChatColumn from "@/organisms/Footer/FooterChatColumn";
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import { getSocialUrl } from "@/lib/social-urls";
import { trackEvent } from "@/services/analytics";

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

  const handleClick = () => {
    trackEvent("nav_footer_click", {
      label,
      href,
      source: "footer",
    });
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
      aria-label={label}
      onClick={handleClick}
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
        <section className="footer-top">
          <div className="footer-top__identity">
            <section className="footer-group footer-group--identity">
              <Copyright />
            </section>
          </div>

          <div className="footer-top__groups">
            <section className="footer-group footer-group--contact">
              <h3 className="footer-group__title">Contact</h3>
              <div className="footer-group__list">
                <Telegram />
                <CopyEmail />
                <FooterChatColumn />
              </div>
            </section>

            <section className="footer-group footer-group--links">
              <h3 className="footer-group__title">Links</h3>
              <div className="footer-group__list">
                <FooterLinkItem
                  href={githubUrl}
                  icon={GitHubIcon}
                  label="GitHub"
                />
                <FooterLinkItem
                  href={linkedinUrl}
                  icon={LinkedInIcon}
                  label="LinkedIn"
                />
              </div>
            </section>
          </div>
        </section>

        <section
          className="footer-bottom"
          aria-label="Technology stack summary"
        >
          <p className="footer-meta footer-meta--lead">
            Built with Next.js · React · TypeScript · Tailwind CSS
          </p>
          <div className="footer-tech-block">
            <p className="footer-meta-row">
              <span className="footer-meta-key">State &amp; Data:</span>
              <span className="footer-meta-value">
                Redux Toolkit · TanStack Query · Zod
              </span>
            </p>
            <p className="footer-meta-row">
              <span className="footer-meta-key">Motion &amp; UI:</span>
              <span className="footer-meta-value">
                Framer Motion · Storybook
              </span>
            </p>
            <p className="footer-meta-row">
              <span className="footer-meta-key">
                Testing &amp; Accessibility:
              </span>
              <span className="footer-meta-value">
                Playwright · Jest · axe-core
              </span>
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
