import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-solid border-dark font-medium text-lg">
      <div
        className="w-full h-full inline-block z-0 bg-light px-32 py-8 flex
        items-center justify-between"
      >
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>

        <div className="flex items-center">
          Build With<span className="text-primary text-2xl px-1">&#9825;</span>
          by &nbsp;
          <Link
            href="https://github.com/angelthunder"
            target={"_blank"}
            className="underline underline-offset-2"
          >
            AngelThunder
          </Link>
        </div>

        <Link href="https://angelthunder.dev" target={"_blank"}>
          Say hello
        </Link>
      </div>
    </footer>
  );
}
