import React from "react";

import "./styles.css";

const parseCoreFocus = (value?: string): string[] => {
  if (!value) {
    return [];
  }

  const parsed = value
    .split(/\r?\n|,|\|/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return parsed;
};

const AboutDetails = (): React.JSX.Element | null => {
  const detailsText = process.env.NEXT_PUBLIC_ABOUT_DETAILS_TEXT?.trim() || "";
  const coreFocus = parseCoreFocus(process.env.NEXT_PUBLIC_ABOUT_CORE_FOCUS);

  if (!detailsText && coreFocus.length === 0) {
    return null;
  }

  return (
    <section className="about-details" aria-label="Core focus details">
      {detailsText && <p className="about-details__text">{detailsText}</p>}

      {coreFocus.length > 0 && (
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
