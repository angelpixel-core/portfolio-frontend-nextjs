import { CircularText } from "@/components/ui/icons";
import Link from "next/link";

export default function HireMe() {
  return (
    <div
      className="fixed flex items-center justify-center
      overflow-hidden
      left-4 bottom-4
      md:right-8 md:left-auto md:top-0 md:bottom-auto md:absolute"
    >
      <div
        className="h-auto flex items-center justify-center relative
        w-48 md:w-24"
      >
        <CircularText
          className={"fill-dark animate-spin-slow dark:fill-light"}
          fillSvgColor="dark:fill-white"
        />

        <Link
          href="mailto:abcd@gmail.com"
          className="flex items-center justify-center absolute left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2 shawdow-md border
          border-solid border-dark rounded-full font-semibold
          bg-dark text-light hover:bg-light hover:text-dark 
          dark:bg-light dark:text-dark hover:dark:bg-dark
          hover:dark:text-light hover:dark:border-light
          w-20 h-20 md:w-12 md:h-12 md:text-[10px]"
        >
          Hire Me
        </Link>
      </div>
    </div>
  );
}
