import { FeaturedBoxShadow } from "@/atoms/shadows";
import Hero from "@/molecules/Hero";
import Biography from "@/organisms/Biography";
import WordCloud from "@/organisms/WordCloud";
import Experiences from "@/organisms/Experiences";
import Academics from "@/organisms/Academics";
import Hiring from "@/organisms/Hiring";

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

          {/* Hero image: hidden until 640px, then grid layout */}
          <div className="about-hero_image-container">
            <FeaturedBoxShadow />
            <div className="about-hero_inner-frame">
              <Hero
                name="toon"
                imageSrc="/images/about/toon-tatoo.png"
                size={300}
                className="about-hero_image"
              />
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

      {/* CTA: Hire Me Button */}
      <Hiring />
    </>
  );
}
