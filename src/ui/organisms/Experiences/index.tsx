"use client";

import "./styles.css";

import { History } from "@/atoms/hocs";
import { Skeleton } from "./skeleton";
import Experience from "@/molecules/Experience";
import PlatformProjectExperience from "@/molecules/Experience/PlatformProjectExperience";
import { useJobExperiences } from "@/domains/job-experience/queries";
import type { JobExperience } from "@/domains/job-experience";

type JobExperienceGroup = "engineering" | "platform";

const GROUP_ORDER: JobExperienceGroup[] = ["engineering", "platform"];

const GROUP_LABEL: Record<JobExperienceGroup, string> = {
  engineering: "Selected Engineering Experience",
  platform: "Selected Platform Projects",
};

const isSupportedGroup = (group: unknown): group is JobExperienceGroup =>
  GROUP_ORDER.includes(group as JobExperienceGroup);

const groupExperiences = (experiences: JobExperience[]) =>
  experiences.reduce<Record<JobExperienceGroup, JobExperience[]>>(
    (acc, experience) => {
      if (!isSupportedGroup(experience.group)) {
        return acc;
      }

      acc[experience.group].push(experience);
      return acc;
    },
    {
      engineering: [],
      platform: [],
    }
  );

const renderExperienceByGroup = (experience: JobExperience) => {
  if (experience.group === "platform") {
    return (
      <PlatformProjectExperience
        key={experience.id}
        company={experience.company}
        companyLink={experience.companyLink}
        contextBadges={experience.contextBadges}
        technologies={experience.technologies}
        work={experience.work}
      />
    );
  }

  return (
    <Experience
      key={experience.id}
      id={experience.id}
      position={experience.position}
      company={experience.company}
      companyLink={experience.companyLink}
      year={experience.year}
      address={experience.address}
      contextBadges={experience.contextBadges}
      technologies={experience.technologies}
      work={experience.work}
    />
  );
};

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

  const groupedExperiences = groupExperiences(experiences);
  const availableGroups = GROUP_ORDER.filter(
    (group) => groupedExperiences[group].length > 0
  );

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
      {availableGroups.map((group) => (
        <div
          key={group}
          className={`experiences-group experiences-group--${group}`}
        >
          <h3 className="experiences-group__title">{GROUP_LABEL[group]}</h3>
          <History>
            {groupedExperiences[group].map((experience) =>
              renderExperienceByGroup(experience)
            )}
          </History>
        </div>
      ))}
    </section>
  );
};

export default Experiences;
