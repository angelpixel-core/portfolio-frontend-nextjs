"use client";

import Link from "next/link";

import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";

export default function CustomMobileLink({
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
      className={`${className} relative group`}
      onClick={handleClick}
    >
      {title}

      <span
        className={clsx(
          `h-[1px] inline-block absolute left-0 -bottom-0.5
          group-hover:w-full transition-[width] ease duration-300
          bg-light dark:bg-dark`,

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
