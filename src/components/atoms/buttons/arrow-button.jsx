import Link from "next/link";
import LinkArrowIcon from "@/atoms/icons/link-arrow-icon";

export default function ArrowButton({ text }) {
  return (
    <Link
      href="/resume.pdf"
      target={"_blank"}
      className="
        flex items-center
        p-2.5 md:p-2
        px-6 md:px-4
        font-semibold
        text-lg md:text-base
        text-light hover:text-dark
        dark:text-dark hover:dark:text-light
        bg-dark hover:bg-light
        dark:bg-light hover:dark:bg-dark
        rounded-lg
        border-2 border-solid border-transparent
        hover:border-dark hover:dark:border-light
        capitalize
      "
      download={true}
    >
      {text} <LinkArrowIcon className={"w-6 ml-1"} />
    </Link>
  );
}
