import AnimatedNumber from "@/components/ui/animated-number";

export default function ExtraInfo({ number, subtitle }) {
  return (
    <div className="flex flex-col items-end justify-center">
      <span className="inline-block text-7xl font-bold">
        <AnimatedNumber value={number} />+
      </span>
      <h2 className="text-xl font-medium capitalize text-dark/75">
        {subtitle}
      </h2>
    </div>
  );
}
