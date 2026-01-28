"use client";

import "./styles.css";

import { History } from "@/atoms/hocs";
import { Skeleton } from "./skeleton";
import { Experience } from "@/molecules";
import { useJobExperiences } from "@/hooks";

const Experiences = () => {
  const { data: experiences = [], isLoading, isError } = useJobExperiences();

  if (isLoading) {
    return (
      <section
        className="experiences-container"
        aria-labelledby="experiences-heading"
        data-testid="experiences-container-loading"
      >
        <h2 id="experiences-heading" className="experiences-title">
          Experiences
        </h2>
        <History>
          <Skeleton />
        </History>
      </section>
    );
  }

  if (isError || !experiences.length) {
    return (
      <section
        className="experiences-container"
        aria-labelledby="experiences-heading"
        data-testid="experiences-container-fallback"
      >
        <h2 id="experiences-heading" className="experiences-title">
          Experiences
        </h2>
        <p>Unable to load experiences.</p>
      </section>
    );
  }

  return (
    <section
      className="experiences-container"
      aria-labelledby="experiences-heading"
      aria-label="Professional work history"
      data-testid="experiences-container"
    >
      <h2 id="experiences-heading" className="experiences-title">
        Experiences
      </h2>
      <History>
        {experiences.map((experience) => (
          <Experience
            key={experience.id}
            id={experience.id}
            position={experience.position}
            company={experience.company}
            companyLink={experience.companyLink}
            time={experience.time}
            address={experience.address}
            work={experience.work}
          />
        ))}
      </History>
    </section>
  );
};

export default Experiences;
