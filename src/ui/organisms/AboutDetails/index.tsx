import React from "react";

import "./styles.css";

const parseCoreFocus = (value?: string): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n|,|\|/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

interface AboutDetailsProps {
  showText?: boolean;
  showFocus?: boolean;
  className?: string;
}

const AboutDetails = ({
  showText = true,
  showFocus = true,
  className,
}: AboutDetailsProps): React.JSX.Element | null => {
  const detailsText = process.env.NEXT_PUBLIC_ABOUT_DETAILS_TEXT?.trim() || "";
  const coreFocus = parseCoreFocus(process.env.NEXT_PUBLIC_ABOUT_CORE_FOCUS);

  const hasText = showText && detailsText.length > 0;
  const hasFocus = showFocus && coreFocus.length > 0;

  if (!hasText && !hasFocus) {
    return null;
  }

  const rootClassName = className
    ? `about-details ${className}`
    : "about-details";

  return (
    <section className={rootClassName} aria-label="Core focus details">
      {hasText && <p className="about-details__text">{detailsText}</p>}

      {hasFocus && (
        <div className="about-details__focus-block">
          <h3 className="about-details__focus-title">Core Focus</h3>
          <ul className="about-details__focus-list">
            {coreFocus.map((item) => (
              <li key={item} className="about-details__focus-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default AboutDetails;
