import "./styles.css";
import { MainContainer } from "@/atoms/hocs";
import {
  Resume,
  Calendar,
  CustomersSlider,
  TechnologiesSlider,
  Hero,
  Paragraph,
  Title,
  TransitionEffect,
} from "@/molecules";

export default function HomePage() {
  return (
    <>
      <TransitionEffect />
      <section className="main_home">
        {/* Primary Blade - Hero + Content + Slider (mobile) */}
        <MainContainer
          className="main_home-container"
          data-testid="home-hero-blade"
        >
          <div className="home-container">
            <div
              className="home-hero_image-container"
              data-testid="profile-hero-image"
            >
              <Hero
                name="hero"
                size="512"
                sizes="(max-width: 640px) 280px, 450px"
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
