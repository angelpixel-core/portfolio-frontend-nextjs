import project1 from "@/images/projects/crypto-screener-cover-image.jpg";
import project2 from "@/images/projects/devdreaming.jpg";
import project3 from "@/images/projects/nft-collection-website-cover-image.jpg";
import project4 from "@/images/projects/fashion-studio-website.jpg";
import project5 from "@/images/projects/agency-website-cover-image.jpg";
import project6 from "@/images/projects/portfolio-cover-image.jpg";

export const fetchProjects = () => {
  try {
    const projects = [
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

    return projects;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch projects.");
  }
};
