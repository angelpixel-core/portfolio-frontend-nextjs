"use client";

import "./styles.css";

import { History } from "@/atoms/hocs";
import { Education } from "@/molecules";
import { useAcademics } from "@/hooks";

const Academics = () => {
  const { data: academics = [], isLoading, isError } = useAcademics();

  if (isLoading) {
    return (
      <section
        className="academics-container"
        aria-labelledby="academics-heading"
      >
        <h2 id="academics-heading" className="academics-title">
          Education
        </h2>
        <p>Loading education...</p>
      </section>
    );
  }

  if (isError || !academics.length) {
    return (
      <section
        className="academics-container"
        aria-labelledby="academics-heading"
      >
        <h2 id="academics-heading" className="academics-title">
          Education
        </h2>
        <p>Unable to load education.</p>
      </section>
    );
  }

  return (
    <section
      className="academics-container"
      aria-labelledby="academics-heading"
    >
      <h2 id="academics-heading" className="academics-title">
        Education
      </h2>
      <History>
        {academics.map((education, index) => (
          <Education key={index} props={education} />
        ))}
      </History>
    </section>
  );
};

export default Academics;
