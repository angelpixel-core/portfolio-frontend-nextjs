import TransitionEffect from "@/molecules/layout/transition-effect";
import MainContainer from "@/hoc/main-container";
import HeroImage from "@/molecules/home/hero-image";
import AnimatedTitle from "@/atoms/texts/animated-title";
import Paragraph from "@/atoms/texts/paragraph";
import HireMe from "@/molecules/home/hire-me";
import ArrowButton from "@/atoms/buttons/arrow-button";
import BaseLink from "@/atoms/links/base-link";

export default async function Home() {
  const title = "Turning Vision Into Reality With Code And Design.";
  const mainParagraph =
    "As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in React.js and web development.";

  return (
    <>
      <TransitionEffect />

      <main className="flex items-center w-full text-dark dark:text-light">
        <MainContainer className="pt-0 md:pt-16 sm:pt-8">
          <div className="flex lg:flex-col items-center justify-between w-full">
            <div className="w-1/2 md:w-full">
              <HeroImage
                name="hero"
                size="50vw"
                className="md:inline-block rounded-full p-2"
              />
            </div>

            <div
              className="
                w-1/2 lg:w-full
                flex flex-col items-center self-center
                lg:text-center
              "
            >
              <AnimatedTitle
                text={title}
                className="
                  !text-left lg:!text-center
                  !text-6xl xl:!text-5xl lg:!text-6xl md:!text-5xl sm:!text-3xl
                "
              />

              <Paragraph
                text={mainParagraph}
                className="my-4 text-base md:text-sm sm:text-xs"
              />

              <div className="flex items-cemter self-start mt-2 lg:self-center">
                <ArrowButton text="resume" />

                <BaseLink
                  href="mailto:angelthunder@mail.com"
                  target="_blank"
                  text="contact"
                  className="
                    ml-4
                    text-lg
                    font-medium
                    capitalize
                    flex items-center
                    text-dark
                    dark:text-light
                    md:text-base
                  "
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
