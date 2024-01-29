const all = () => [
  {
    page: "home",
    title: "Design vision, implement the code and ship the future.",
    // title: "Coding and Designing the Future, Step by Step.",
    /* title: "Turning Vision Into Reality With Code And Design.", */
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
    title: "",
    mainContent: "",
  },
  {
    page: "projects",
    title: "",
    mainContent: "",
  },
];

export function fetchContent({ page }) {
  return all().find((item) => item.page === page);
}
