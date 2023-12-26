import { fetchExperiences } from "@/data/experiences";

import History from "@/hoc/history";
import Experience from "@/molecules/about/experience";

export default function Experiences() {
  const title = "Experiences";
  const experiences = fetchExperiences();

  return (
    <History title={title}>
      {experiences.map((experience, index) => (
        <Experience
          key={index}
          position={experience.position}
          company={experience.company}
          companyLink={experience.companyLink}
          time={experience.time}
          address={experience.address}
          work={experience.work}
        />
      ))}
    </History>
  );
}
