"use client";

import "./styles.css";

import { useRouter } from "next/navigation";

import { ActiveMarkFloating } from "@/atoms/texts";
import { useMenuPanel } from "@/state/slices";

const navigationItemButton = ({ href, name, className = "" }) => {
  const router = useRouter();
  const { setMenuPanel } = useMenuPanel();

  const handleClick = () => {
    router.push(href);
    setMenuPanel(false);
  };

  return (
    <button
      type="button"
      className={
        `${className} navigation-item_button group` /* TODO: check `group` Tailwind rule */
      }
      onClick={handleClick}
    >
      {name}
      <ActiveMarkFloating activePath={href} />
    </button>
  );
};

export default navigationItemButton;
