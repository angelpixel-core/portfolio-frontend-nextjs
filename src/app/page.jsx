import "./styles.css";

import { MainContainer } from "@/atoms/hocs";

import {
  Resume,
  Calendar,
  CustomersSlider,
  Hero,
  HireMe,
  Paragraph,
  Title,
  TransitionEffect,
} from "@/molecules";

export default function HomePage() {
  return (
    <>
      <TransitionEffect />
      <main className="main_home">
        <MainContainer className="main_home-container">
          <div className="home-container">
            <div className="home-hero_image-container">
              <Hero
                name="hero"
                size="512"
                className="home-hero_image ligthning"
              />
            </div>

            <div className="home-content">
              <Title className="home_title" />

              <Paragraph className="home_slogan" />

              <div className="home_contact-container">
                <Resume />

                <Calendar className="home_contact-link" />
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
