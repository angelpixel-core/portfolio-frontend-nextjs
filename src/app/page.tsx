import React from "react";
import "./styles.css";
import dynamic from "next/dynamic";
import { MainContainer } from "@/atoms/hocs";
import Resume from "@/molecules/Resume";
import Calendar from "@/molecules/Calendar";
import Hero from "@/molecules/Hero";
import Paragraph from "@/molecules/Paragraph";
import Title from "@/molecules/Title";
import TransitionEffect from "@/molecules/TransitionEffect";

// Lazy load sliders - below fold on mobile, defers CSS loading
// Lighthouse: Eliminate render-blocking resources
const CustomersSlider = dynamic(() => import("@/molecules/CustomersSlider"), {
  ssr: true,
});
const TechnologiesSlider = dynamic(
  () => import("@/molecules/TechnologiesSlider"),
  { ssr: true }
);

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <TransitionEffect />
      <section className="main__home">
        {/* Primary Blade - Hero + Content + Slider (mobile) */}
        <MainContainer
          className="main__home-container"
          data-testid="home-hero-blade"
        >
          <div className="home-container">
            <div
              className="home-hero__image-container"
              data-testid="profile-hero-image"
            >
              <Hero
                name="hero"
                size={512}
                sizes="(max-width: 640px) 280px, 450px"
                className="home-hero__image ligthning"
              />
            </div>

            <div className="home-content">
              <Title className="home__title" />

              <Paragraph className="home__slogan" />

              <div
                className="home__contact-container"
                data-testid="profile-hero-contact"
              >
                <Resume />

                <Calendar className="home__contact-link" />
              </div>
            </div>
          </div>

          {/* Sliders - Inside primary blade */}
          <div
            className="home-slider-container"
            data-testid="home-slider-container"
          >
            <CustomersSlider />
            <TechnologiesSlider />
          </div>
        </MainContainer>
      </section>
    </>
  );
}
