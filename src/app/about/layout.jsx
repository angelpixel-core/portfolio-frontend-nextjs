import AnimatedText from "@/components/ui/animated-text";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      {/* Layout */}
      <div className="w-full h-full inline-block z-0 bg-light p-32 pt-16">
        <AnimatedText text="Passion Fuels Purpose!" className="mb-16" />
        {children}
      </div>
    </main>
  );
}
