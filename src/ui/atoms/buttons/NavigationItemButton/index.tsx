"use client";

import "./styles.css";

import { useRouter } from "next/navigation";

import ActiveMark from "@/texts/ActiveMark";
import useMenuPanel from "@/state/slices/menuPanel/hooks";

interface NavigationItemButtonProps {
  href: string;
  name: string;
  className?: string;
}

const NavigationItemButton = ({
  href,
  name,
  className = "",
}: NavigationItemButtonProps) => {
  const router = useRouter();
  const { setMenuPanel } = useMenuPanel();

  const handleClick = () => {
    router.push(href);
    setMenuPanel(false);
  };

  return (
    <button
      type="button"
      className={`${className} navigation-item__button focus-ring group`}
      onClick={handleClick}
    >
      {name}
      <ActiveMark activePath={href} />
    </button>
  );
};

export default NavigationItemButton;
