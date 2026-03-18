/**
 * NavigationItemLink - Navigation link with active state indicator
 *
 * Story 12.5: Added optional onClick prop for menu auto-close functionality.
 * When used in floating menu, onClick is called to close menu on navigation.
 *
 * Story 13.2: Now uses TransitionLink to trigger page transitions via
 * TransitionProvider instead of direct Next.js navigation.
 *
 * @param {string} href - Target route path
 * @param {string} name - Display text for the link
 * @param {string} className - Additional CSS classes
 * @param {function} [onClick] - Optional click handler (used for menu auto-close)
 *
 * @see docs/layout-system.md for navigation patterns
 */
import React from "react";

import "./styles.css";

import TransitionLink from "@/links/TransitionLink";
import ActiveMark from "@/atoms/texts/ActiveMark";
import { trackEvent } from "@/services/analytics";

interface NavigationItemLinkProps {
  href: string;
  name: string;
  className: string;
  onClick?: (_event: React.MouseEvent<HTMLAnchorElement>) => void;
  source?: "primary" | "menu";
}

const NavigationItemLink = ({
  href,
  name,
  className,
  onClick,
  source,
}: NavigationItemLinkProps): React.JSX.Element => {
  // Generate testid from href: /projects -> nav-header-projects-link
  const testId = `nav-header-${href === "/" ? "home" : href.replace("/", "")}-link`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (source === "menu") {
      trackEvent("nav_menu_click", { label: name, href, source });
    }

    if (source === "primary") {
      trackEvent("nav_primary_click", { label: name, href, source });
    }

    onClick?.(event);
  };

  return (
    <TransitionLink
      href={href}
      className={`${className} navigation-item__name group`}
      data-testid={testId}
      onClick={handleClick}
    >
      {name}
      <ActiveMark activePath={href} />
    </TransitionLink>
  );
};

export default NavigationItemLink;
