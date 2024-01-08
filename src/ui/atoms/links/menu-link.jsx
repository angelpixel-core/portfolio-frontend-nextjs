import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export const MenuLink = ({ href, title, className = "" }) => {
  const pathname = usePathname();

  return (
    <Link href={href} className={`${className} nav-option_title group`}>
      {title}

      <span
        className={clsx(`nav-option--active dark:bg-light bg-dark`, {
          "w-full": pathname === href,
          "w-0": pathname !== href,
        })}
      >
        &nbsp;
      </span>
    </Link>
  );
};
