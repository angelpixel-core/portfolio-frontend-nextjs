import "./styles.css";

import Link from "next/link";
import { ActiveMark } from "@/texts";

const NavigationItemLink = ({ href, name, className }) => {
  return (
    <Link href={href} className={`${className} navigation-item_name`}>
      {/* TODO: check about `group` tailwind rule */}
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
};

export default NavigationItemLink;
