import project1 from "@/images/projects/crypto-screener-cover-image.jpg";
import project2 from "@/images/projects/devdreaming.jpg";
import project3 from "@/images/projects/nft-collection-website-cover-image.jpg";
import project4 from "@/images/projects/fashion-studio-website.jpg";
import project5 from "@/images/projects/agency-website-cover-image.jpg";
import project6 from "@/images/projects/portfolio-cover-image.jpg";

import blog from "@/images/projects/incoming/blog.svg";
import crypto from "@/images/projects/incoming/crypto-screener.svg";
import portfolio from "@/images/projects/incoming/portfolio.svg";
import marketplace from "@/images/projects/incoming/marketplace.svg";
import nft from "@/images/projects/incoming/nft-collection.svg";
import utm from "@/images/projects/incoming/utm.svg";

const all = () => [
  {
    img: blog,
    title: "Personal Blog",
    summary:
      "A professional portfolio website using Ruby on Rails. It has smooth page transitions, cool background effects, unique design and it is mobile responsive.",
    link: "/not-found",
    github: "/not-found",
    tags: "Social Media Ruby on Rails, Stimulus, HOTwire, ",
    featured: true,
  },
  {
    img: crypto,
    title: "Crypto Screener Application",
    summary:
      "A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your local currency.",
    link: "/not-found",
    github: "/not-found",
    tags: "Web Site NextJS",
    featured: false,
  },
  {
    img: portfolio,
    title: "Portfolio",
    summary: "",
    link: "/demo",
    github: "https://github.com/AngelThunder/portfolio",
    tags: "Web Site NextJS",
    featured: false,
  },
  {
    img: marketplace,
    title: "Marketplace",
    summary:
      "A professional Marketplace website using React JS, Framer-motion, and Styled-components. It has smooth page transitions, cool background effects, unique design and it is mobile responsive.",
    link: "/not-found",
    github: "/not-found",
    tags: "Ecommerce Ruby on Rails",
    featured: true,
  },
  {
    img: nft,
    title: "React Dashboard BackOffice",
    link: "/not-found",
    github: "/not-found",
    tags: "Reac NTF Web3 BackOffice",
    featured: false,
  },
  {
    img: utm,
    title: "Rails UTM App",
    link: "/not-found",
    github: "/not-found",
    tags: "Rails UTM App",
    featured: false,
  },
  {
    img: project1,
    title: "Crypto Screener Application",
    summary:
      "A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your local currency.",
    link: "/demo",
    github: "https://github.com/AngelThunder/crypto-screener",
    tags: "Back Office ReactJS",
    featured: true,
  },
  {
    img: project2,
    title: "Portfolio",
    link: "/demo",
    github: "https://github.com/AngelThunder/portfolio",
    tags: "Web Site NextJS",
    featured: false,
  },
  {
    img: project3,
    title: "Blog",
    link: "/demo",
    github: "https://github.com/AngelThunder/blog",
    tags: "Social Media AstroJS",
    featured: false,
  },
  {
    title: "Marketplace",
    img: project4,
    summary:
      "A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth page transitions, cool background effects, unique design and it is mobile responsive.",
    link: "/demo",
    github: "https://github.com/AngelThunder/marketplace",
    tags: "Ecommerce Ruby on Rails",
    featured: true,
  },
  {
    img: project5,
    title: "React Dashboard BackOffice",
    link: "/demo",
    github: "https://github.com/AngelThunder/dashboard-backoffice",
    tags: "Featured Project",
    featured: false,
  },
  {
    img: project6,
    title: "Rails UTM App",
    link: "/demo",
    github: "https://github.com/AngelThunder/utm-app",
    tags: "Featured Project",
    featured: false,
  },
];

export async function fetchProjects() {
  try {
    return await all();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch projects.");
  }
}
