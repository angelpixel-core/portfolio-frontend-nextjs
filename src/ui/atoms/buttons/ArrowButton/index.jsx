import "./styles.css";

import Link from "next/link";
import { ArrowIcon } from "@/atoms/icons";

const ArrowButton = ({ href, text, target = "_blank" }) => {
  return (
    <Link href={href} target={target} className="arrow-link" download={true}>
      {text}
      <ArrowIcon className="arrow-icon" />
    </Link>
  );
};

export default ArrowButton;
