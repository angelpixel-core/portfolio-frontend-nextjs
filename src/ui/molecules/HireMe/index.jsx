import "./styles.css";

import Link from "next/link";
import { CircularText } from "@/atoms/texts";

const HireMe = () => {
  const profile = { telegram: "https://t.me/angelszymczak" };

  return (
    <div className="hire-me_container" data-testid="hire-me-circular">
      <div className="hire-me_content">
        <CircularText
          className="hire-me_circular-text"
          fillSvgColor="dark:fill-white"
        />

        <Link
          href={profile.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="hire-me_link"
          data-testid="hire-me-link"
        >
          hire me
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
