"use client";

import Link from "next/link";

import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function ActiveLink({ href, title, className = "" }) {
  const pathname = usePathname();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}

      <span
        className={clsx(
          `
            absolute
            inline-block
            group-hover:w-full
            h-[1px]
            left-0
            -bottom-0.5
            transition-[width] ease duration-300
            bg-dark dark:bg-light
          `,
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
