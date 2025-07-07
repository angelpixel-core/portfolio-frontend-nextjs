import { articlesService as service } from "@/services";

const Article = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Article;

/*
const articles = [
  {
    id: 1,
    name: "custom-pagination-component-in-react",
    title: "Build A Custom Pagination Component In Reactjs From Scratch",
    link: "/not-found",
    imageSrc: "/images/articles/pagination component in reactjs.jpg",
    time: "9 min read",
    date: "March 22, 2023",
    visibility: "Public",
    featured: true,
    summary:
      "Learn how to build a custom pagination component in ReactJS from scratch. Follow this step-by-step guide to integrate Pagination component in your ReactJS project.",
  },
  {
    id: 2,
    name: "loading-screens-in-react",
    title:
      "Creating Stunning Loading Screens In React: Build 3 Types Of Loading Screens",
    link: "/not-found",
    imageSrc: "/images/articles/create loading screen in react js.jpg",
    time: "10 min read",
    date: "March 22, 2023",
    visibility: "Public",
    featured: true,
    summary:
      "Learn how to create stunning loading screens in React with 3 different methods. Discover how to use React-Loading, React-Lottie & build a custom loading screen. Improve the user experience.",
  },
  {
    id: 3,
    name: "form-validation-in-react",
    title:
      "Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling",
    link: "/not-found",
    imageSrc:
      "/images/articles/form validation in reactjs using custom react hook.png",
    time: "12 min read",
    date: "March 22, 2023",
    visibility: "Public",
    featured: false,
    summary: "",
  },
  {
    id: 4,
    name: "modal-component-in-react",
    title:
      "Creating An Efficient Modal Component In React Using Hooks And Portals",
    link: "/not-found",
    imageSrc:
      "/images/articles/create modal component in react using react portals.png",
    time: "10 min read",
    date: "March 22, 2023",
    visibility: "Public",
    featured: false,
    summary: "",
  },
  {
    id: 5,
    name: "redux-for-web-developers",
    title: "Redux Simplified: A Beginner's Guide For Web Developers",
    link: "/not-found",
    imageSrc: "/images/articles/What is Redux with easy explanation.png",
    time: "16 min read",
    date: "March 22, 2023",
    visibility: "Public",
    featured: false,
    summary: "",
  },
  {
    id: 6,
    name: "hoc-in-react",
    title: "What Is Higher Order Component (Hoc) In React?",
    link: "/not-found",
    imageSrc: "/images/articles/What is higher order component in React.jpg",
    time: "20 min read",
    date: "March 22, 2023",
    visibility: "Public",
    featured: false,
    summary: "",
  },
];

export function all() {
  return articles;
}

export const Article = {
  all,
};
*/
