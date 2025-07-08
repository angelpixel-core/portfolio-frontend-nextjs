import { ExperienceStat } from "@/models";
import { ExtraInfo } from "@/molecules";

export async function ExtraInfoList() {
  const stats = await ExperienceStat.all();

  return (
    <>
      {stats.map(({ number, subtitle }, idx) => (
        <ExtraInfo key={idx} number={number} subtitle={subtitle} />
      ))}
    </>
  );
}
