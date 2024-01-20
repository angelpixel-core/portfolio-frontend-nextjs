import "./styles.css";

import { History } from "@/hoc/_index";
import { Education } from "@/molecules/about/_index";

export async function Academics({ items }) {
  return (
    <div className="academics-container">
      <h2 className="academics-title">Education</h2>
      <History>
        {items.map((education, index) => (
          <Education key={index} props={education} />
        ))}
      </History>
    </div>
  );
}
