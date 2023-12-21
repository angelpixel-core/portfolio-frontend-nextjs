import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/hoc/with-container";

export const metadata = {
  title: "Articles",
};

export default function Page({ children }) {
  return (
    <main
      className="w-full mb-16 flex flex-col items-center justify-center
      overflow-hidden"
    >
      <WithContainer className="pt-16">
        <AnimatedText text="Words Can Change The World!" className="mb-16" />
        {children}
      </WithContainer>
    </main>
  );
}
