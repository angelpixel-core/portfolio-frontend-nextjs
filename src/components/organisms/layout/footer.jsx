import MainContainer from "@/hoc/main-container";
import BaseLink from "@/atoms/links/base-link";

export default function Footer() {
  return (
    <footer
      className="
        w-full
        font-medium
        text-lg sm:text-base
        dark:text-light
        border-solid border-t-2
        border-dark dark:border-light
      "
    >
      <MainContainer
        className="
          flex lg:flex-col
          items-center justify-between
          py-8 lg:py-6
        "
      >
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>

        <div className="flex items-center lg:py-2">
          Build With
          <span
            className="
              px-1
              text-2xl
              text-primary dark:text-primaryDark
            "
          >
            &#9825;
          </span>
          by &nbsp;
          <BaseLink
            href="https://github.com/angelthunder"
            target="_blank"
            text="AngelThunder"
          />
        </div>

        <BaseLink
          href="https://angelthunder.dev"
          target="_blank"
          text="Say Hello"
        />
      </MainContainer>
    </footer>
  );
}
