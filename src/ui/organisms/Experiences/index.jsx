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
      <div className="experiences-container">
        <h2 className="experiences-title">Experiences</h2>
        <History>
          <Skeleton />
        </History>
      </div>
    );
  }

  if (isError || !experiences.length) {
    return (
      <div className="experiences-container">
        <h2 className="experiences-title">Experiences</h2>
        <p>Unable to load experiences.</p>
      </div>
    );
  }

  return (
    <div className="experiences-container">
      <h2 className="experiences-title">Experiences</h2>
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
    </div>
  );
};

export default Experiences;
