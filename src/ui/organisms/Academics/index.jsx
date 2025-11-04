"use client";

import "./styles.css";

import { History } from "@/atoms/hocs";
import { Education } from "@/molecules";
import { useAcademics } from "@/hooks";

const Academics = () => {
  const { data: academics = [], isLoading, isError } = useAcademics();

  if (isLoading) {
    return (
      <div className="academics-container">
        <h2 className="academics-title">Education</h2>
        <p>Loading education...</p>
      </div>
    );
  }

  if (isError || !academics.length) {
    return (
      <div className="academics-container">
        <h2 className="academics-title">Education</h2>
        <p>Unable to load education.</p>
      </div>
    );
  }

  return (
    <div className="academics-container">
      <h2 className="academics-title">Education</h2>
      <History>
        {academics.map((education, index) => (
          <Education key={index} props={education} />
        ))}
      </History>
    </div>
  );
};

export default Academics;
