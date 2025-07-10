import "./styles.css";

import { History } from "@/atoms/hocs";
import { Education } from "@/molecules";

import { useAcademics } from "@/hooks";

const Academics = () => {
  const { data: academics = [] } = useAcademics();

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

export default Academics;
