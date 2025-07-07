import { contentsService as service } from "@/services";

const Content = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Content;

/*
TODO: remove it
const contents = [
  {
    page: "home",
    title: "Design vision, implement the code and ship the future.",
    mainContent:
      "As a skilled Full-Stack developer, I am dedicated to turning ideas into Scalable Web Solutions. Explore my latest projects and articles, showcasing my expertise in Ruby + Rails and HTML, CSS, JavaScrit + React/NextJS.",
  },
  {
    page: "about",
    title: "Passion Fuels Purpose!",
    mainContent: "no hay",
  },
  {
    page: "articles",
    title: "este es de articles",
    mainContent: "",
  },
  {
    page: "projects",
    title: "titulo de projects",
    mainContent: "",
  },
];

const fetchBy = async ({ page }) => {
  return await contents.find((content) => content.page === page);
};
*/
