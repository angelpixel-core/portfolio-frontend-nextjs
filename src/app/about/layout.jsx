import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/HOCs/with-container";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <WithContainer className="pt-16">
        <AnimatedText text="Passion Fuels Purpose!" className="mb-16" />
        {children}
      </WithContainer>
    </main>
  );
}
