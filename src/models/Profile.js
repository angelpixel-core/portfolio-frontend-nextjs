import { jsonData, tryQuery } from "@/lib/utils";

async function all() {
  return await tryQuery(async () => await jsonData("profiles"));
}

async function findBy({ email }) {
  return await tryQuery(
    async () =>
      await all().then((items) => items.find((i) => i.email === email))
  );
}

export const Profile = {
  findBy,
};
