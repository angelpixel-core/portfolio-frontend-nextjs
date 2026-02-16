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

interface NavigationItemLinkProps {
  href: string;
  name: string;
  className: string;
  onClick?: () => void;
}

const NavigationItemLink = ({
  href,
  name,
  className,
  onClick,
}: NavigationItemLinkProps): React.JSX.Element => {
  // Generate testid from href: /projects -> nav-header-projects-link
  const testId = `nav-header-${href === "/" ? "home" : href.replace("/", "")}-link`;

  return (
    <TransitionLink
      href={href}
      className={`${className} navigation-item_name group`}
      data-testid={testId}
      onClick={onClick}
    >
      {name}
      <ActiveMark activePath={href} />
    </TransitionLink>
  );
};

export default NavigationItemLink;
