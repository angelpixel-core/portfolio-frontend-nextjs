"use client";

import "./styles.css";

import { History } from "@/atoms/hocs";
import Education from "@/molecules/Education";
import { useAcademics } from "@/domains/academic";

/**
 * Academics organism - displays educational background section
 * Story 3.3: Academic Background
 * Story 3.4: Graceful empty state handling
 */
const Academics = () => {
  const { data: academics = [], isLoading, isError } = useAcademics();

  // Show loading skeleton during fetch
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

  // Show error state only on actual error
  if (isError) {
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

  // Gracefully hide section if no academics (Story 3.4 AC2)
  if (!academics.length) {
    return null;
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
