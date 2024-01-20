import "./styles.css";

import { ExtraInfo } from "@/molecules/about/_index";

export const Extras = ({ items }) => {
  return (
    <div className="extras-container">
      {items.map(({ number, subtitle }, index) => (
        <ExtraInfo key={index} number={number} subtitle={subtitle} />
      ))}
    </div>
  );
};
