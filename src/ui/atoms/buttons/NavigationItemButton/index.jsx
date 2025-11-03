"use client";

import "./styles.css";

import { useRouter } from "next/navigation";

import { ActiveMark } from "@/texts";
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
      className={`${className} navigation-item_button group`}
      onClick={handleClick}
    >
      {name}
      <ActiveMark activePath={href} />
    </button>
  );
};

export default navigationItemButton;
