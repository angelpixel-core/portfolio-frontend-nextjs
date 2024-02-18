import "./styles.css";

import { Academic } from "@/models/_index";

import { History } from "@/atoms/hocs/_index";
import { Education } from "@/molecules/_index";

const email = process.env.PROFILE_EMAIL;

export async function Academics() {
  const academics = await Academic.fetchBy({ email });

  const AcademicsContent = () =>
    academics.map((education, index) => (
      <Education key={index} props={education} />
    ));
  return (
    <div className="academics-container">
      <h2 className="academics-title">Education</h2>
      <History>
        <AcademicsContent />
      </History>
    </div>
  );
}
