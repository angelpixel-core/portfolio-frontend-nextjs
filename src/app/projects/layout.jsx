import WithContainer from "@/components/hoc/with-container";
import AnimatedText from "@/components/ui/animated-text";

export const metadata = {
  title: "Projects",
};

export default function Layout({ children }) {
  return (
    <main
      className="w-full flex flex-col items-center justify-center mb-16
      dark:text-light"
    >
      <WithContainer className="pt-16">
        <AnimatedText
          text="Imagination Trumps Knowledge!"
          className="mb-16 sm:mb-8
          lg:!text-7xl sm:!text-6xl xs:!text-4xl"
        />
        {children}
      </WithContainer>
    </main>
  );
}
