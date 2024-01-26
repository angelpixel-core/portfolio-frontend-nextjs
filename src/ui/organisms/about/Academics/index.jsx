import "./styles.css";

import { History } from "@/hoc/_index";
import { Education } from "@/molecules/about/_index";

import { fetchAcademics } from "@/lib/data/_index";

export async function Academics() {
  const academics = await fetchAcademics({
    email: process.env.PROFILE_EMAIL,
  });

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
