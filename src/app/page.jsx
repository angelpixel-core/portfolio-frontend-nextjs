import "./styles.css";

import { MainContainer } from "@/hoc/_index";
import { AnimatedTitle, Paragraph } from "@/atoms/texts/_index";
import { ArrowButton } from "@/atoms/buttons/_index";
import { BaseLink } from "@/atoms/links/_index";
import { HeroImage, HireMe } from "@/molecules/home/_index";
import { TransitionEffect } from "@/molecules/layout/_index";

export default async function Home() {
  const title = "Turning Vision Into Reality With Code And Design.";
  const mainParagraph =
    "As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in React.js and web development.";
  const emailAddress = "angelthunder@mail.com";

  return (
    <>
      <TransitionEffect />
      <main className="main_home">
        <MainContainer className="main_home-container">
          <div className="home-container">
            <div className="home-hero_image-container">
              <HeroImage name="hero" size="50vw" className="home-hero_image" />
            </div>

            <div className="home-content">
              <AnimatedTitle text={title} className="home_title-text" />

              <Paragraph text={mainParagraph} className="home_paragraph-text" />

              <div className="home_contact-container">
                <ArrowButton text="resume" />

                <BaseLink
                  href={`mailto:${emailAddress}`}
                  target="_blank"
                  text="contact"
                  className="home_contact-link"
                />
              </div>
            </div>
          </div>
        </MainContainer>

        <HireMe />
      </main>
    </>
  );
}
