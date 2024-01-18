import "./styles.css";

import Link from "next/link";
import { CircularText } from "@/atoms/texts/_index";

export const HireMe = () => {
  const text = "hire me";
  const profile = { telegram: "https:/t.me/angelszymczak" };

  return (
    <div className="hire-me_container">
      <div className="hire-me_content">
        <CircularText
          className="hire-me_circular-text"
          fillSvgColor="dark:fill-white"
        />

        <Link href={profile.telegram} target="_blank" className="hire-me_link">
          {text}
        </Link>
      </div>
    </div>
  );
};
