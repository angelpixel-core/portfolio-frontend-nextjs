import { fetchExtras } from "@/data/extras";

import ExtraInfo from "@/molecules/about/extra-info";

export default function Extras() {
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
}
