import "./styles.css";

import { MainContainer } from "@/hoc/_index";
import { AnimatedTitle, Paragraph } from "@/atoms/texts/_index";
import { ArrowButton } from "@/atoms/buttons/_index";
import { CalendarLink } from "@/atoms/links/_index";
import { HeroImage, HireMe, CustomersSlider } from "@/molecules/home/_index";
import { TransitionEffect } from "@/molecules/layout/_index";

import { fetchContent, fetchProfile } from "@/lib/data/_index";

export default function Home() {
  const { title, mainContent } = fetchContent({ page: "home" });
  const { resume, calendly } = fetchProfile({
    email: process.env.PROFILE_EMAIL,
  });

  return (
    <>
      <TransitionEffect />
      <main className="main_home">
        <MainContainer className="main_home-container">
          <div className="home-container">
            <div className="home-hero_image-container">
              <HeroImage
                name="hero"
                size="512"
                className="home-hero_image ligthning"
                href={calendly}
              />
            </div>

            <div className="home-content">
              <AnimatedTitle text={title} className="home_title" />

              <Paragraph text={mainContent} className="home_slogan" />

              <div className="home_contact-container">
                <ArrowButton text="resume" href={resume} />

                <CalendarLink
                  href={calendly}
                  target="_blank"
                  text="contact"
                  className="home_contact-link"
                />
              </div>
            </div>
          </div>
        </MainContainer>

        <CustomersSlider />

        <HireMe />
      </main>
    </>
  );
}
