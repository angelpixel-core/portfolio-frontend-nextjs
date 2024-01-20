const all = () => [
  {
    page: "home",
    title: "Coding and Designing the Future, Step by Step.",
    /* title: "Turning Vision Into Reality With Code And Design.", */
    mainContent:
      "As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in Ruby + Rails and HTML, CSS, JavaScrit + React/NextJS for layout and web development.",
  },
  {
    page: "about",
    title: "Passion Fuels Purpose!",
    mainContent: "",
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
