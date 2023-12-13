import Link from "next/link";
import WithContainer from "@/components/hoc/with-container";

export default function Footer() {
  return (
    <footer
      className="w-full border-t-2 border-solid border-dark font-medium
      text-lg dark:text-light dark:border-light"
    >
      <WithContainer className="py-8 flex items-center justify-between">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>

        <div className="flex items-center">
          Build With
          <span className="text-primary dark:text-primaryDark text-2xl px-1">
            &#9825;
          </span>
          by &nbsp;
          <Link
            href="https://github.com/angelthunder"
            target={"_blank"}
            className="underline underline-offset-2"
          >
            AngelThunder
          </Link>
        </div>

        <Link
          href="https://angelthunder.dev"
          target={"_blank"}
          className="underline underline-offset-2"
        >
          Say hello
        </Link>
      </WithContainer>
    </footer>
  );
}
