import { FeaturedBoxShadow } from "@/atoms/shadows";
import { Hero } from "@/molecules";
import { Biography, WordCloud, Experiences, Academics } from "@/organisms";

export default function AboutPage() {
  return (
    <>
      {/* First Blade: Title + Biography */}
      <section className="about-first-blade">
        <div className="about-headline-wrapper">
          <h1 className="about-headline">I design systems, not just code.</h1>
          {/* Subtle underline - structural micro-detail */}
          <span className="about-headline-underline" aria-hidden="true" />
        </div>

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

      {/* Transition node - semantic separator */}
      <div className="about-transition-node" aria-hidden="true" />

      {/* Expertise Section - Conceptual Word Cloud */}
      <section className="about-expertise_container">
        <h2 className="about-expertise_title">Skills</h2>
        <WordCloud />
      </section>

      {/* Experience & Education */}
      <Experiences />
      <Academics />
    </>
  );
}
