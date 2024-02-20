import { jsonData } from "@/lib/utils";

import image1 from "@/images/projects/incoming/blog.svg";
import image2 from "@/images/projects/incoming/crypto-screener.svg";
import image3 from "@/images/projects/incoming/portfolio.svg";
import image4 from "@/images/projects/incoming/marketplace.svg";
import image5 from "@/images/projects/incoming/nft-collection.svg";
import image6 from "@/images/projects/incoming/utm.svg";

const images = [image1, image2, image3, image4, image5, image6];

const all = async () =>
  await jsonData("projects").then((items) =>
    items.map((i, idx) => ({ ...i, img: images[idx] }))
  );

export const Project = {
  all,
};
