/**
 * SocialNetworkLink - External social network link with icon
 *
 * Story 12.5: Added optional onClick prop for menu auto-close functionality.
 * When used in floating menu, onClick is called to close menu on click.
 *
 * @param {string} href - External URL to link to
 * @param {string} iconName - Name of the social network icon to display
 * @param {string} iconClassName - Additional CSS classes for the icon
 * @param {string} [ariaLabel] - Accessible label (defaults to iconName)
 * @param {function} [onClick] - Optional click handler (used for menu auto-close)
 *
 * @see docs/layout-system.md for social link patterns
 */
"use client";

import React from "react";

import "./styles.css";

import { default as Icon } from "./Icon";

interface SocialNetworkLinkProps {
  href: string;
  iconName: string;
  iconClassName: string;
  ariaLabel?: string;
  onClick?: () => void;
}

const SocialNetworkLink = ({
  href,
  iconName,
  iconClassName,
  ariaLabel,
  onClick,
}: SocialNetworkLinkProps): React.JSX.Element => {
  const label = ariaLabel || iconName;
  // Generate testid from iconName: github -> nav-social-github-link
  const testId = `nav-social-${(iconName || "unknown").toLowerCase()}-link`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="social_link"
      data-testid={testId}
      onClick={onClick}
    >
      <Icon name={iconName} className={`social_link-icon ${iconClassName}`} />
    </a>
  );
};

export default SocialNetworkLink;
