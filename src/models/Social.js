import { jsonData } from "@/lib/utils";

async function all() {
  return await jsonData("socials");
}

export const Social = {
  all: async () => await all().then((items) => items.filter((i) => i.enabled)),
};
