import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/hoc/with-container";
import FeaturedArticle from "@/components/ui/articles/featured-article";
import Article from "@/components/ui/articles/article";

import articlePic1 from "@/images/articles/pagination component in reactjs.jpg";
import articlePic2 from "@/images/articles/create loading screen in react js.jpg";
import articlePic3 from "@/images/articles/form validation in reactjs using custom react hook.png";
import articlePic4 from "@/images/articles/create modal component in react using react portals.png";
import articlePic5 from "@/images/articles/What is Redux with easy explanation.png";
import articlePic6 from "@/images/articles/What is higher order component in React.jpg";

export const metadata = {
  title: "Articles",
};

export default function Page() {
  return (
    <main
      className="w-full mb-16 flex flex-col items-center justify-center
      overflow-hidden"
    >
      <WithContainer className="pt-16">
        <AnimatedText text="Words Can Change The World!" className="mb-16" />

        <ul className="grid grid-cols-2 gap-16">
          <FeaturedArticle
            title="Build A Custom Pagination Component In Reactjs From Scratch"
            img={articlePic1}
            summary="Learn how to build a custom pagination component in ReactJS
            from scratch. Follow this step-by-step guide to integrate Pagination
            component in your ReactJS project."
            time="9 min read"
            link="/"
          />

          <FeaturedArticle
            title="Creating Stunning Loading Screens In React: Build 3 Types Of
            Loading Screens"
            img={articlePic2}
            summary="Learn how to create stunning loading screens in React with
            3 different methods. Discover how to use React-Loading, React-Lottie
            & build a custom loading screen. Improve the user experience."
            time="10 min read"
            link="/"
          />
        </ul>

        <h2 className="font-bold text-4xl w-full text-center my-16 mt-32">
          All Articles
        </h2>
        <ul>
          <Article
            title="Form Validation In Reactjs: Build A Reusable Custom Hook For
            Inputs And Error Handling"
            img={articlePic3}
            date="March 22, 2023"
            link="/"
          />
          <Article
            title="Creating An Efficient Modal Component In React Using Hooks
            And Portals"
            img={articlePic4}
            date="March 22, 2023"
            link="/"
          />
          <Article
            title="Redux Simplified: A Beginner's Guide For Web Developers"
            img={articlePic5}
            date="March 22, 2023"
            link="/"
          />
          <Article
            title="What Is Higher Order Component (Hoc) In React?"
            img={articlePic6}
            date="March 22, 2023"
            link="/"
          />
        </ul>
      </WithContainer>
    </main>
  );
}
