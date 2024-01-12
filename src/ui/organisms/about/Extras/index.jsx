import "./styles.css";

import { fetchExtras } from "@/data/extras/_index";

import { ExtraInfo } from "@/molecules/about/_index";

export const Extras = () => {
  const extras = fetchExtras();

  return (
    <div className="extras-container">
      {extras.map(({ number, subtitle }, index) => (
        <ExtraInfo key={index} number={number} subtitle={subtitle} />
      ))}
    </div>
  );
};
