import FeaturedArticle from "@/organisms/articles/featured-article";
import Article from "@/organisms/articles/article";

import articlePic1 from "@/images/articles/pagination component in reactjs.jpg";
import articlePic2 from "@/images/articles/create loading screen in react js.jpg";
import articlePic3 from "@/images/articles/form validation in reactjs using custom react hook.png";
import articlePic4 from "@/images/articles/create modal component in react using react portals.png";
import articlePic5 from "@/images/articles/What is Redux with easy explanation.png";
import articlePic6 from "@/images/articles/What is higher order component in React.jpg";

export default function Page() {
  const featuredArticles = [
    {
      title: "Build A Custom Pagination Component In Reactjs From Scratch",
      img: articlePic1,
      summary:
        "Learn how to build a custom pagination component in ReactJS from scratch. Follow this step-by-step guide to integrate Pagination component in your ReactJS project.",
      time: "9 min read",
      link: "/",
    },

    {
      title:
        "Creating Stunning Loading Screens In React: Build 3 Types Of Loading Screens",
      img: articlePic2,
      summary:
        "Learn how to create stunning loading screens in React with 3 different methods. Discover how to use React-Loading, React-Lottie & build a custom loading screen. Improve the user experience.",
      time: "10 min read",
      link: "/",
    },
  ];

  const articles = [
    {
      title:
        "Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling",
      img: articlePic3,
      date: "March 22, 2023",
      link: "/",
    },
    {
      title:
        "Creating An Efficient Modal Component In React Using Hooks And Portals",
      img: articlePic4,
      date: "March 22, 2023",
      link: "/",
    },
    {
      title: "Redux Simplified: A Beginner's Guide For Web Developers",
      img: articlePic5,
      date: "March 22, 2023",
      link: "/",
    },
    {
      title: "What Is Higher Order Component (Hoc) In React?",
      img: articlePic6,
      date: "March 22, 2023",
      link: "/",
    },
  ];

  return (
    <>
      <ul
        className="
          grid
          grid-cols-2 md:grid-cols-1
          gap-16 lg:gap-8 md:gap-y-16
        "
      >
        {featuredArticles.map(({ title, img, summary, time, link }, index) => (
          <FeaturedArticle
            key={index}
            title={title}
            img={img}
            summary={summary}
            time={time}
            link={link}
          />
        ))}
      </ul>

      <h2
        className="
        w-full
        my-16 mt-32
        text-4xl
        text-center
        font-bold
        dark:text-light
        "
      >
        All Articles
      </h2>

      <ul>
        {articles.map(({ title, img, date, link }, index) => (
          <Article
            key={index}
            title={title}
            img={img}
            date={date}
            link={link}
          />
        ))}
      </ul>
    </>
  );
}
