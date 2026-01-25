"use client";

import "./styles.css";

import { History } from "@/atoms/hocs";
import { Education } from "@/molecules";
import { useAcademics } from "@/domains/academic";

/**
 * Academics organism - displays educational background section
 * Story 3.3: Academic Background
 */
const Academics = () => {
  const { data: academics = [], isLoading, isError } = useAcademics();

  if (isLoading) {
    return (
      <section
        className="academics-container"
        aria-labelledby="academics-heading"
        aria-label="Educational background"
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
        aria-label="Educational background"
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
      aria-label="Educational background"
    >
      <h2 id="academics-heading" className="academics-title">
        Education
      </h2>
      <History>
        {academics.map((academic) => (
          <Education key={academic.id} {...academic} />
        ))}
      </History>
    </section>
  );
};

export default Academics;
