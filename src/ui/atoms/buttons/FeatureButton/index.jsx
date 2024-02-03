import "./styles.css";

import { useRouter } from "next/navigation";
import { ActiveMarkFloating } from "@/atoms/texts/_index";

export function FeatureButton({ href, name, className = "" }) {
  const router = useRouter();

  return (
    <button
      href={href}
      className={`${className} feature_button group`}
      onClick={() => router.push(href)}
    >
      {/* check about `group` Tailwind rule */}
      {name}
      <ActiveMarkFloating activePath={href} />
    </button>
  );
}
