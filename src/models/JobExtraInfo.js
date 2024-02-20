import { jsonData, tryQuery } from "@/lib/utils";

async function all() {
  return await tryQuery(async () => await jsonData("extra-info"));
}

export const JobExtraInfo = {
  all,
};
