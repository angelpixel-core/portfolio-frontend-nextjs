import { fetchExtras } from "@/data/extras/_index";
import { ExtraInfo } from "@/molecules/about/_index";

export const Extras = () => {
  const extras = fetchExtras();

  return (
    <div
      className="
        flex flex-col xl:flex-row
        justify-between
        items-end xl:items-center
        col-span-2 xl:col-span-8
        md:order-3
      "
    >
      {extras.map(({ number, subtitle }, index) => (
        <ExtraInfo key={index} number={number} subtitle={subtitle} />
      ))}
    </div>
  );
};
