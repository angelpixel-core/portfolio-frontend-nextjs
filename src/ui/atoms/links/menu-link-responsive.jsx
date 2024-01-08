import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export const MenuLinkResponsive = ({ href, title, className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => router.push(href);

  return (
    <button
      href={href}
      className={`group nav-option_title--responsive ${className}`}
      onClick={handleClick}
    >
      {title}

      <span
        className={clsx(`nav-option--active bg-light dark:bg-dark`, {
          "w-full": pathname === href,
          "w-0": pathname !== href,
        })}
      >
        &nbsp;
      </span>
    </button>
  );
};
