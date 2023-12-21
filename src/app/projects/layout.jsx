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
        <AnimatedText text="Imagination Trumps Knowledge!" className="mb-16" />
        {children}
      </WithContainer>
    </main>
  );
}
