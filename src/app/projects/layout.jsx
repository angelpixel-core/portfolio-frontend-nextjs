import TransitionEffect from "@/molecules/layout/transition-effect";
import MainContainer from "@/hoc/main-container";
import AnimatedTitle from "@/atoms/texts/animated-title";

export const metadata = {
  title: "Projects",
};

export default function Layout({ children }) {
  return (
    <>
      <TransitionEffect />

      <main
        className="
          w-full
          flex flex-col items-center justify-center
          mb-16
          dark:text-light
        "
      >
        <MainContainer className="pt-16">
          <AnimatedTitle
            text="Imagination Trumps Knowledge!"
            className="
              mb-16 sm:mb-8
              lg:!text-7xl sm:!text-6xl xs:!text-4xl
            "
          />
          {children}
        </MainContainer>
      </main>
    </>
  );
}
