import { fetchAcademics } from "@/data/academics/_index";
import { History } from "@/hoc/_index";
import { Education } from "@/molecules/about/_index";

export const Academics = async () => {
  const academics = await fetchAcademics();

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
};
