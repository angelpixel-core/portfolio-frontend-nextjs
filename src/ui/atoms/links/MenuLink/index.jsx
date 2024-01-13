import "./styles.css";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export const MenuLink = ({ href, title, className = "" }) => {
  const pathname = usePathname();

  /* TODO: check about `group` tailwind rule */
  return (
    <Link href={href} className={`group ${className} nav-option_title`}>
      {title}

      <span
        className={clsx("menu_active-bar", {
          "w-full": pathname === href,
          "w-0": pathname !== href,
        })}
      >
        &nbsp;
      </span>
    </Link>
  );
};
