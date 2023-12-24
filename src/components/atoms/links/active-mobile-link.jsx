"use client";

import Link from "next/link";

import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";

export default function ActiveMobileLink({
  href,
  title,
  toggle,
  className = "",
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <button
      href={href}
      className={`
        relative
        my-2
        group
        text-light dark:text-dark
        ${className}
      `}
      onClick={handleClick}
    >
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
            bg-light dark:bg-dark
          `,
          {
            "w-full": pathname === href,
            "w-0": pathname !== href,
          },
        )}
      >
        &nbsp;
      </span>
    </button>
  );
}
