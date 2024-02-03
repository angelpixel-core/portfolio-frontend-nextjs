import "./styles.css";

import Link from "next/link";
import { ActiveMark } from "@/atoms/texts/_index";

export function FeatureLink({ href, name, className }) {
  return (
    <Link href={href} className={`${className} feature_name`}>
      {/* TODO: check about `group` tailwind rule */}
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
}
