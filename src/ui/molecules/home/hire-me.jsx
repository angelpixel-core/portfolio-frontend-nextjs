import Link from "next/link";
import { CircularText } from "@/atoms/texts/_index";

export const HireMe = () => {
  const text = "hire me";
  const email = "abcd@gmail.com";

  return (
    <div className="hire-me_container">
      <div className="hire-me_content">
        <CircularText
          className="hire-me_circular-text"
          fillSvgColor="dark:fill-white"
        />

        <Link href={`mailto:${email}`} className="hire-me_link">
          {text}
        </Link>
      </div>
    </div>
  );
};
