import { fetchExperiences } from "@/data/experiences/_index";
import { History } from "@/hoc/_index";
import { Experience } from "@/molecules/about/_index";

export const Experiences = () => {
  const title = "Experiences";
  const experiences = fetchExperiences();

  return (
    <div className="experiences-container">
      <h2 className="experiences-title">{title}</h2>

      <History>
        {experiences.map((experience, index) => (
          <Experience key={index} props={experience} />
        ))}
      </History>
    </div>
  );
};
