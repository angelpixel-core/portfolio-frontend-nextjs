import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/hoc/with-container";
import Skills from "@/components/ui/about/skills";
import Experience from "@/components/ui/about/experience";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <WithContainer className="pt-16">
        <AnimatedText text="Passion Fuels Purpose!" className="mb-16" />
        {children}
        <Skills />
        <Experience />
      </WithContainer>
    </main>
  );
}
