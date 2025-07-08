import { JobExperience } from "@/models";
import { Experience } from "@/molecules";

export async function ExperienceList() {
  const experiences = await JobExperience.findBy({ id: 1 });

  return (
    <>
      {experiences.map(
        ({ position, company, companyLink, time, address, work }, idx) => (
          <Experience
            key={idx}
            position={position}
            company={company}
            companyLink={companyLink}
            time={time}
            address={address}
            work={work}
          />
        )
      )}
    </>
  );
}
