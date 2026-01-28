/**
 * NavigationItemLink - Navigation link with active state indicator
 *
 * Story 12.5: Added optional onClick prop for menu auto-close functionality.
 * When used in floating menu, onClick is called to close menu on navigation.
 *
 * @param {string} href - Target route path
 * @param {string} name - Display text for the link
 * @param {string} className - Additional CSS classes
 * @param {function} [onClick] - Optional click handler (used for menu auto-close)
 *
 * @see docs/layout-system.md for navigation patterns
 */
import "./styles.css";

import Link from "next/link";
import { ActiveMark } from "@/texts";

const NavigationItemLink = ({ href, name, className, onClick }) => {
  // Generate testid from href: /projects -> nav-header-projects-link
  const testId = `nav-header-${href === "/" ? "home" : href.replace("/", "")}-link`;

  return (
    <Link
      href={href}
      className={`${className} navigation-item_name group`}
      data-testid={testId}
      onClick={onClick}
    >
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
};

export default NavigationItemLink;
