import "./styles.css";

import { Suspense } from "react";

import { History } from "@/atoms/hocs";
import { Skeleton } from "./skeleton";
import { Experience } from "@/molecules";

import { useJobExperiences } from "@/hooks";

const Experiences = () => {
  const { data: experiences = [] } = useJobExperiences();

  return (
    <div className="experiences-container">
      <h2 className="experiences-title">Experiences</h2>

      <History>
        <Suspense fallback={<Skeleton />}>
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
        </Suspense>
      </History>
    </div>
  );
};

export default Experiences;
