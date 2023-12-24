import CircularText from "@/atoms/texts/circular-text";
import Link from "next/link";

export default function HireMe() {
  const text = "hire me";

  return (
    <div
      className="
        lg:absolute
        fixed
        flex items-center justify-center
        overflow-hidden
        left-4 lg:left-auto
        lg:top-0
        lg:right-8 sm:right-0
        bottom-4 lg:bottom-auto
      "
    >
      <div
        className="
          relative
          h-auto
          flex
          items-center justify-center
          w-48 lg:w-24
        "
      >
        <CircularText
          className={"fill-dark animate-spin-slow dark:fill-light"}
          fillSvgColor="dark:fill-white"
        />

        <Link
          href="mailto:abcd@gmail.com"
          className="
            absolute
            flex
            items-center justify-center
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            shawdow-md border
            border-solid
            border-dark hover:dark:border-light
            rounded-full
            font-semibold
            bg-dark hover:bg-light dark:bg-light hover:dark:bg-dark
            text-light hover:text-dark dark:text-dark hover:dark:text-light
            w-20 lg:w-12
            h-20 lg:h-12
            lg:text-[10px]
            capitalize
          "
        >
          {text}
        </Link>
      </div>
    </div>
  );
}
