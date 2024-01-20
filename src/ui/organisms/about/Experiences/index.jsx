import "./styles.css";

import { History } from "@/hoc/_index";
import { Experience } from "@/molecules/about/_index";

export const Experiences = ({ items }) => {
  return (
    <div className="experiences-container">
      <h2 className="experiences-title">Experiences</h2>

      <History>
        {items.map((experience, index) => (
          <Experience key={index} props={experience} />
        ))}
      </History>
    </div>
  );
};
