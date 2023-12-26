import article1 from "@/images/articles/pagination component in reactjs.jpg";
import article2 from "@/images/articles/create loading screen in react js.jpg";
import article3 from "@/images/articles/form validation in reactjs using custom react hook.png";
import article4 from "@/images/articles/create modal component in react using react portals.png";
import article5 from "@/images/articles/What is Redux with easy explanation.png";
import article6 from "@/images/articles/What is higher order component in React.jpg";

import { promises as fs } from "fs";

export async function fetchArticles() {
  try {
    const filename = `${process.cwd()}/src/lib/data/articles.json`;
    const file = await fs.readFile(filename, "utf8");
    const imageFiles = [article3, article4, article5, article6];

    let articles = await JSON.parse(file);
    articles = await articles.map((article, index) => ({
      ...article,
      img: imageFiles[index],
    }));

    return articles;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch Articles.`);
  }
}

export async function fetchFeaturedArticles() {
  try {
    const filename = `${process.cwd()}/src/lib/data/articles.featured.json`;
    const file = await fs.readFile(filename, "utf8");
    const imageFiles = [article1, article2];

    let articles = JSON.parse(file);
    articles = await articles.map((article, index) => ({
      ...article,
      img: imageFiles[index],
    }));

    return articles;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch FeaturedArticles.`);
  }
}
