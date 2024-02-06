"use client";

import "./styles.css";

import { useRouter } from "next/navigation";
import { ActiveMarkFloating } from "@/atoms/texts/_index";

import { useDispatch } from "react-redux";
import { setIsMenuOpen } from "@/slices/menu/menuSlice";

export function FeatureButton({ href, name, className = "" }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = () => {
    router.push(href);
    dispatch(setIsMenuOpen(false));
  };

  return (
    <button
      href={href}
      className={`${className} feature_button group`}
      onClick={handleClick}
    >
      {/* TODO: check `group` Tailwind rule */}
      {name}
      <ActiveMarkFloating activePath={href} />
    </button>
  );
}
