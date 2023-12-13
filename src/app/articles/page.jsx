import AnimatedText from "@/components/ui/animated-text";
import WithContainer from "@/components/hoc/with-container";
import FeaturedArticle from "@/components/ui/articles/featured-article";

import articlePic1 from "@/images/articles/pagination component in reactjs.jpg";
import articlePic2 from "@/images/articles/create loading screen in react js.jpg";

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
      </WithContainer>
    </main>
  );
}
