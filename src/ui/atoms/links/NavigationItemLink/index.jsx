import "./styles.css";

import Link from "next/link";
import { ActiveMark } from "@/texts";

const NavigationItemLink = ({ href, name, className }) => {
  // Generate testid from href: /projects -> nav-header-projects-link
  const testId = `nav-header-${href === "/" ? "home" : href.replace("/", "")}-link`;

  return (
    <Link
      href={href}
      className={`${className} navigation-item_name group`}
      data-testid={testId}
    >
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
};

export default NavigationItemLink;
