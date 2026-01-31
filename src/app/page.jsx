import "./styles.css";
import { MainContainer } from "@/atoms/hocs";
import {
  Resume,
  Calendar,
  CustomersSlider,
  Hero,
  Paragraph,
  Title,
  TransitionEffect,
} from "@/molecules";
import { Footer } from "@/organisms";

export default function HomePage() {
  return (
    <>
      <TransitionEffect />
      <main className="main_home">
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

          {/* Customers Slider - Inside primary blade on mobile */}
          <div
            className="home-slider-container"
            data-testid="home-slider-container"
          >
            <CustomersSlider />
          </div>
        </MainContainer>

        {/* Footer Blade - Intrinsic height, NOT full viewport */}
        <footer
          className="home_footer-blade"
          data-testid="home-secondary-blade"
        >
          <Footer />
        </footer>
      </main>
    </>
  );
}
