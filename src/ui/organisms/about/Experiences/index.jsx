import "./styles.css";

import { fetchExperiences } from "@/lib/data/_index";

import { History } from "@/hoc/_index";
import { Experience } from "@/molecules/about/_index";

export async function Experiences() {
  const experiences = await fetchExperiences({
    email: process.env.PROFILE_EMAIL,
  });

  const ExperiencesContent = () =>
    experiences.map((experience, index) => (
      <Experience key={index} props={experience} />
    ));

  return (
    <div className="experiences-container">
      <h2 className="experiences-title">Experiences</h2>

      <History>
        <ExperiencesContent />
      </History>
    </div>
  );
}
