import { JobExtraInfo } from "@/models";
import { ExtraInfo } from "@/molecules";

export async function ExtraInfoList() {
  const extraInfo = await JobExtraInfo.all().then((info) =>
    info.map(({ number, subtitle }, idx) => (
      <ExtraInfo key={idx} number={number} subtitle={subtitle} />
    ))
  );

  return <>{extraInfo}</>;
}
