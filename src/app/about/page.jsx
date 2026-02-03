import { FeaturedBoxShadow } from "@/atoms/shadows";
import { Hero, SkillSelector } from "@/molecules";
import { Biography, Skills, Experiences, Academics } from "@/organisms";

export default function AboutPage() {
  return (
    <>
      {/* First Blade: Title + Biography */}
      <section className="about-first-blade">
        <h1 className="about-headline">I design systems, not just code.</h1>

        <div className="about-content">
          <div className="about_biography-container">
            <Biography />
          </div>

          {/* Hero image: hidden on mobile (≤375px) */}
          <div className="about-hero_image-container">
            <FeaturedBoxShadow />
            <div className="bg-dark rounded-[1rem] border-2 border-dark dark:border-light">
              <Hero name="me" size={300} className="about-hero_image" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <div className="about-skills_container">
        <h2 className="about-skills_title">skills</h2>
        <SkillSelector />
        <Skills />
      </div>

      {/* Experience & Education */}
      <Experiences />
      <Academics />
    </>
  );
}
