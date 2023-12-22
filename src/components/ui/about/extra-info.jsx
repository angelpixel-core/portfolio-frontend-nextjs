import AnimatedNumber from "@/components/ui/animated-number";

export default function ExtraInfo({ number, subtitle }) {
  return (
    <div className="flex flex-col items-end xl:items-center justify-center">
      <span
        className="inline-block text-7xl font-bold
        md:text-6xl sm:text-5xl xs:text-4xl"
      >
        <AnimatedNumber value={number} />+
      </span>

      <h2
        className="text-xl font-medium capitalize text-dark/75 dark:text-light/75
        xl:text-center md:text-lg sm:tetx-base xs:text-sm"
      >
        {subtitle}
      </h2>
    </div>
  );
}
