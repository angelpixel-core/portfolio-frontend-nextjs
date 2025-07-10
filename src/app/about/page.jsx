import { FeaturedBoxShadow } from "@/atoms/shadows";
import { Hero, SkillSelector } from "@/molecules";
import {
  Biography,
  ExperienceStats,
  Skills,
  Experiences,
  Academics,
  Hiring,
} from "@/organisms";

export default function AboutPage() {
  return (
    <>
      <div className="about-content">
        <div className="about_biography-container">
          <Biography />
        </div>

        <div className="about-hero_image-container">
          <FeaturedBoxShadow />

          <div className="bg-dark rounded-[1rem] border-2 border-dark dark:border-light">
            <Hero name="me" size={300} className="about-hero_image" />
          </div>
        </div>

        <ExperienceStats />
      </div>

      <div className="about-skills_container">
        <h2 className="about-skills_title">skills</h2>

        <SkillSelector />
        <Skills />
      </div>

      <Experiences />
      <Academics />
      <Hiring />
    </>
  );
}
