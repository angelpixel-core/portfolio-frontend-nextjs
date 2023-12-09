"use client";

import Link from "next/link";
import Logo from "@/components/ui/logo";

import clsx from "clsx";
import { usePathname } from "next/navigation";

const CustomLink = ({ href, title, className = "" }) => {
  const pathname = usePathname();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}

      <span
        className={clsx(
          "h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300",

          {
            "w-full": pathname === href,
            "w-0": pathname !== href,
          },
        )}
      >
        &nbsp;
      </span>
    </Link>
  );
};

export default function NavBar() {
  return (
    <header className="w-full px-32 py-8 font-medium flex items-center justify-between">
      <nav>
        <CustomLink href="/" title="Home" className="mr-4" />
        <CustomLink href="/about" title="About" className="mx-4" />
        <CustomLink href="/projects" title="Projects" className="mx-4" />
        <CustomLink href="/articles" title="Articles" className="mx-4" />
      </nav>

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>

      <nav>
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
      </nav>
    </header>
  );
}
