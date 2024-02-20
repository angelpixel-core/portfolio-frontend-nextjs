import { jsonData, tryQuery } from "@/lib/utils";

import { findImageById } from "./ArticleImages";

async function all() {
  return await jsonData("articles").then((items) =>
    items.map((i) => ({ ...i, img: findImageById(i.id) }))
  );
}

async function fetchBy({ visibility = true, featured = false }) {
  return tryQuery(
    async () =>
      await all().then((items) =>
        items.filter(
          (i) => i.visibility === visibility && i.featured === featured
        )
      )
  );
}

export const Article = {
  all,
  fetchBy,
};
