import article1 from "@/images/articles/pagination component in reactjs.jpg";
import article2 from "@/images/articles/create loading screen in react js.jpg";
import article3 from "@/images/articles/form validation in reactjs using custom react hook.png";
import article4 from "@/images/articles/create modal component in react using react portals.png";
import article5 from "@/images/articles/What is Redux with easy explanation.png";
import article6 from "@/images/articles/What is higher order component in React.jpg";

export const fetchArticles = async () => {
  try {
    return [
      {
        id: 1,
        title: "Build A Custom Pagination Component In Reactjs From Scratch",
        summary:
          "Learn how to build a custom pagination component in ReactJS from scratch. Follow this step-by-step guide to integrate Pagination component in your ReactJS project.",
        time: "9 min read",
        link: "/",
        featured: true,
        img: article1,
      },
      {
        id: 2,
        title:
          "Creating Stunning Loading Screens In React: Build 3 Types Of Loading Screens",
        summary:
          "Learn how to create stunning loading screens in React with 3 different methods. Discover how to use React-Loading, React-Lottie & build a custom loading screen. Improve the user experience.",
        time: "10 min read",
        link: "/",
        featured: true,
        img: article2,
      },
      {
        id: 3,
        title:
          "Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling",
        date: "March 22, 2023",
        link: "/",
        featured: false,
        img: article3,
      },
      {
        id: 4,
        title:
          "Creating An Efficient Modal Component In React Using Hooks And Portals",
        date: "March 22, 2023",
        link: "/",
        featured: false,
        img: article4,
      },
      {
        id: 5,
        title: "Redux Simplified: A Beginner's Guide For Web Developers",
        date: "March 22, 2023",
        link: "/",
        featured: false,
        img: article5,
      },
      {
        id: 6,
        title: "What Is Higher Order Component (Hoc) In React?",
        date: "March 22, 2023",
        link: "/",
        featured: false,
        img: article6,
      },
    ];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch Articles.`);
  }
};
