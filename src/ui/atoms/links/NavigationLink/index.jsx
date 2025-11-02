import "./styles.css";

import Link from "next/link";
import { ActiveMark } from "@/texts";

const NavigationLink = ({ href, label, className }) => {
  return (
    <Link href={href} className={`${className} navigation-link_label`}>
      {/* TODO: check about `group` tailwind rule */}
      {label}
      <ActiveMark activePath={href} />
    </Link>
  );
};

export default NavigationLink;
