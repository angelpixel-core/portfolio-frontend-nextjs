import article1 from "@/images/articles/pagination component in reactjs.jpg";
import article2 from "@/images/articles/create loading screen in react js.jpg";
import article3 from "@/images/articles/form validation in reactjs using custom react hook.png";
import article4 from "@/images/articles/create modal component in react using react portals.png";
import article5 from "@/images/articles/What is Redux with easy explanation.png";
import article6 from "@/images/articles/What is higher order component in React.jpg";

const ArticleImages = [
  { 1: article1 },
  { 2: article2 },
  { 3: article3 },
  { 4: article4 },
  { 5: article5 },
  { 6: article6 },
];

export function findImageById(id) {
  return ArticleImages.find((image) => image.id === id);
}
