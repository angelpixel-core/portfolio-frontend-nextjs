import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/hoc/with-container";
import Skills from "@/components/ui/about/skills";
import Experience from "@/components/ui/about/experience";
import Education from "@/components/ui/about/education";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  return (
    <main
      className="flex flex-col items-center justify-center w-full
      dark:text-light"
    >
      <WithContainer className="pt-16">
        <AnimatedText text="Passion Fuels Purpose!" className="mb-16" />
        {children}
        <Skills />
        <Experience />
        <Education />
      </WithContainer>
    </main>
  );
}
