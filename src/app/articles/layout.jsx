import TransitionEffect from "@/molecules/layout/transition-effect";
import MainContainer from "@/hoc/main-container";
import AnimatedTitle from "@/atoms/texts/animated-title";

export const metadata = {
  title: "Articles",
};

export default function Page({ children }) {
  return (
    <>
      <TransitionEffect />

      <main
        className="
          flex flex-col items-center justify-center
          w-full
          mb-16
          overflow-hidden
        "
      >
        <MainContainer className="pt-16">
          <AnimatedTitle
            text="Words Can Change The World!"
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
