import { Suspense } from "react";

import { FeaturedBoxShadow } from "@/atoms/shadows/_index";
import { HeroImage, SkillSelector } from "@/molecules/_index";
import {
  Biography,
  BiographySkeleton,
  Extras,
  ExtrasSkeleton,
  Skills,
  SkillsSkeleton,
  Experiences,
  ExperiencesSkeleton,
  Academics,
  AcademicsSkeleton,
  Hiring,
} from "@/organisms/about/_index";

export default function Page() {
  return (
    <>
      <div className="about-content">
        <div className="about_biography-container">
          <Suspense fallback={<BiographySkeleton />}>
            <Biography />
          </Suspense>
        </div>

        <div className="about-hero_image-container">
          <FeaturedBoxShadow />

          <div className="bg-dark rounded-[1rem] border-2 border-dark dark:border-light">
            <HeroImage
              name="profile"
              className="about-hero_image"
              sizes="33vw"
            />
          </div>
        </div>

        <Suspense fallback={<ExtrasSkeleton />}>
          <Extras />
        </Suspense>
      </div>

      <div className="about-skills_container">
        <h2 className="about-skills_title">skills</h2>

        <SkillSelector />

        <Suspense fallback={<SkillsSkeleton />}>
          <Skills />
        </Suspense>
      </div>

      <Suspense fallback={<ExperiencesSkeleton />}>
        <Experiences />
      </Suspense>

      <Suspense fallback={<AcademicsSkeleton />}>
        <Academics />
      </Suspense>

      <Hiring />
    </>
  );
}
