import { FeaturedBoxShadow } from "@/atoms/shadows/_index";
import { Hero, SkillSelector } from "@/molecules/_index";
import {
  Biography,
  ExtraInfo,
  Skills,
  Experiences,
  Academics,
  Hiring,
} from "@/organisms/_index";

export default function Page() {
  return (
    <>
      <div className="about-content">
        <div className="about_biography-container">
          <Biography />
        </div>

        <div className="about-hero_image-container">
          <FeaturedBoxShadow />

          <div className="bg-dark rounded-[1rem] border-2 border-dark dark:border-light">
            <Hero name="profile" size="33vw" className="about-hero_image" />
          </div>
        </div>

        <ExtraInfo />
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
