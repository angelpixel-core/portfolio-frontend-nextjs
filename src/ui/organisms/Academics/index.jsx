import "./styles.css";

import { History } from "@/atoms/hocs";
import { Education } from "@/molecules";
import { Academic } from "@/models";

export async function Academics() {
  const academics = await Academic.findBy({ id: 1 });

  return (
    <div className="academics-container">
      <h2 className="academics-title">Education</h2>
      <History>
        {academics.map((education, index) => (
          <Education key={index} props={education} />
        ))}
      </History>
    </div>
  );
}
