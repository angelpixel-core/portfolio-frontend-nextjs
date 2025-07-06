import "./styles.css";

import Link from "next/link";
import { ActiveMark } from "@/texts";

const FeatureLink = ({ href, name, className }) => {
  return (
    <Link href={href} className={`${className} feature_name`}>
      {/* TODO: check about `group` tailwind rule */}
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
};

export default FeatureLink;
