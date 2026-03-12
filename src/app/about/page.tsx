import React from "react";
import { FeaturedBoxShadow } from "@/atoms/shadows";
import Hero from "@/molecules/Hero";
import AboutDetails from "@/organisms/AboutDetails";
import Biography from "@/organisms/Biography";
import WordCloud from "@/organisms/WordCloud";
import Experiences from "@/organisms/Experiences";
import Academics from "@/organisms/Academics";
import Hiring from "@/organisms/Hiring";
import QuoteDoubleLeftIcon from "@/atoms/icons/QuoteDoubleLeftIcon";
import QuoteDoubleRightIcon from "@/atoms/icons/QuoteDoubleRightIcon";

export default function AboutPage(): React.JSX.Element {
  const aboutRole =
    process.env.NEXT_PUBLIC_ABOUT_ROLE || "Software Engineer · Product Systems";
  const aboutDetailsText = process.env.NEXT_PUBLIC_ABOUT_DETAILS_TEXT || "";

  return (
    <>
      {/* First Blade: Title + Biography */}
      <section className="about-first-blade">
        <div className="about-headline-wrapper">
          <h1 className="about-headline">I design systems, not just code.</h1>
          <p className="about-role">{aboutRole}</p>
          {/* Subtle underline - structural micro-detail */}
          <span className="about-headline-underline" aria-hidden="true" />
        </div>

        <div className="about-content">
          <div className="about__biography-container">
            <Biography maxParagraphs={1} />

            <div className="about-details-grid">
              <div className="about-details-focus-block">
                <div className="about-details-focus-copy">
                  <div className="about-details-focus-inline">
                    <QuoteDoubleLeftIcon className="about-details-focus-icon about-details-focus-icon--open" />
                    <Biography
                      maxParagraphs={1}
                      startIndex={1}
                      showMobileHero={false}
                      fallbackText={aboutDetailsText}
                    />
                    <QuoteDoubleRightIcon className="about-details-focus-icon about-details-focus-icon--close" />
                  </div>
                </div>
              </div>

              {/* Hero image: hidden until 640px, then paired with paragraph */}
              <div className="about-hero__image-container">
                <FeaturedBoxShadow />
                <div className="about-hero__inner-frame">
                  <Hero
                    name="toon"
                    imageSrc="/images/about/toon-tatoo.png"
                    size={360}
                    className="about-hero__image"
                  />
                </div>
              </div>
            </div>

            <AboutDetails
              showText={false}
              className="about-details--core-focus"
            />
          </div>
        </div>
      </section>

      {/* Transition node - semantic separator */}
      <div className="about-transition-node" aria-hidden="true" />

      {/* Expertise Section - Conceptual Word Cloud */}
      <section className="about-expertise__container">
        <h2 className="about-expertise__title">Skills</h2>
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
