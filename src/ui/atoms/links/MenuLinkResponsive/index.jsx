import "./styles.css";

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
      className={`group menu-responsive_button ${className}`}
      onClick={handleClick}
    >
      {title}

      <span
        className={clsx("menu-responsive_active-bar", {
          "w-full": pathname === href,
          "w-0": pathname !== href,
        })}
      >
        &nbsp;
      </span>
    </button>
  );
};
