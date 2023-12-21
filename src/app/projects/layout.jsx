import WithContainer from "@/components/hoc/with-container";
import AnimatedText from "@/components/ui/animated-text";

export const metadata = {
  title: "Projects",
};

export default function Layout({ children }) {
  return (
    <main
      className="w-full mb-16 flex flex-col items-center justify-center
      dark:text-light"
    >
      <WithContainer className="pt-16">
        <AnimatedText text="Imagination Trumps Knowledge!" className="mb-16" />
        {children}
      </WithContainer>
    </main>
  );
}
