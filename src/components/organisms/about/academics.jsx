import { fetchAcademics } from "@/data/academics";

import History from "@/hoc/history";
import Education from "@/molecules/about/education";

export default async function Academics() {
  const title = "Education";
  const academics = await fetchAcademics();

  return (
    <History title={title}>
      {academics.map((education, index) => (
        <Education
          key={index}
          type={education.type}
          time={education.time}
          place={education.place}
          info={education.info}
        />
      ))}
    </History>
  );
}
