import TransitionEffect from "@/molecules/layout/transition-effect";
import MainContainer from "@/hoc/main-container";
import AnimatedTitle from "@/atoms/texts/animated-title";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  const title = "Passion Fuels Purpose!";

  return (
    <>
      <TransitionEffect />
      <main
        className="
          flex flex-col
          items-center justify-center
          w-full
          dark:text-light
        "
      >
        <MainContainer className="pt-16">
          <AnimatedTitle
            text={title}
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
