"use client";

import Link from "next/link";

import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function CustomLink({ href, title, className = "" }) {
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
}
