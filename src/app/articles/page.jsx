import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/hoc/with-container";

export const metadata = {
  title: "Articles",
};

export default function Page() {
  return (
    <main
      className="w-full mb-16 flex flex-col items-center justify-center
    overflow-hidden"
    >
      <WithContainer className="pt-16">
        <AnimatedText text="Words Can Change The World!" className="mb-16" />

        <ul className="grid grid-col-2 gap-16">
          <li>Featured Article-1</li>
          <li>Featured Article-2</li>
        </ul>
      </WithContainer>
    </main>
  );
}
