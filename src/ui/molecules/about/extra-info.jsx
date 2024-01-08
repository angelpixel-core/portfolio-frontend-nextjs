import { AnimatedNumber } from "@/atoms/texts/_index";

export const ExtraInfo = ({ number, subtitle }) => {
  return (
    <div className="flex flex-col items-end xl:items-center justify-center">
      <span
        className="
          inline-block
          font-bold
          text-7xl md:text-6xl sm:text-5xl xs:text-4xl
        "
      >
        <AnimatedNumber value={number} />+
      </span>

      <h2
        className="
          capitalize
          font-medium
          text-xl
          text-dark/75 dark:text-light/75
          xl:text-center md:text-lg sm:tetx-base xs:text-sm
        "
      >
        {subtitle}
      </h2>
    </div>
  );
};
