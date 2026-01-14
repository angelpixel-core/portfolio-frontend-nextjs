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
    >
      <h2 id="experiences-heading" className="experiences-title">
        Experiences
      </h2>
      <History>
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
      </History>
    </section>
  );
};

export default Experiences;
