import { jsonData, tryQuery } from "@/lib/utils";

async function all({ enabled = true } = {}) {
  return await tryQuery(
    async () =>
      await jsonData("skills").then((items) =>
        items.filter((i) => i.enabled === enabled)
      )
  );
}

export const TechSkill = {
  all,
};
