import { jsonData, tryQuery } from "@/lib/utils";

async function all() {
  return await tryQuery(async () => await jsonData("experiences"));
}

async function fetchBy({ email }) {
  return await tryQuery(
    async () =>
      await all().then((items) => items.filter((i) => i.email === email))
  );
}

export const JobExperience = {
  all,
  fetchBy,
};
