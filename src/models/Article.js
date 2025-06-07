import { jsonData } from "@/lib/utils";

import image1 from "@/images/articles/pagination component in reactjs.jpg";
import image2 from "@/images/articles/create loading screen in react js.jpg";
import image3 from "@/images/articles/form validation in reactjs using custom react hook.png";
import image4 from "@/images/articles/create modal component in react using react portals.png";
import image5 from "@/images/articles/What is Redux with easy explanation.png";
import image6 from "@/images/articles/What is higher order component in React.jpg";

const images = [image1, image2, image3, image4, image5, image6];

const all = async () =>
  await jsonData("posts").then((items) =>
    items.map((i, idx) => ({ ...i, img: images[idx] }))
  );

export const Article = {
  all,
};
