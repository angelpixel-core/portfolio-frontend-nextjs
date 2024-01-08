import Link from "next/link";
import { ArrowIcon } from "@/atoms/icons/arrow-icon";

export const ArrowButton = ({ text }) => {
  return (
    <Link
      href="/resume.pdf"
      target={"_blank"}
      className="arrow-link"
      download={true}
    >
      {text} <ArrowIcon className="arrow-icon" />
    </Link>
  );
};
