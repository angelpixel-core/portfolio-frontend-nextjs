import Project from "@/molecules/projects/project";
import FeaturedProject from "@/molecules/projects/featured-project";

import project1 from "@/images/projects/crypto-screener-cover-image.jpg";
import project2 from "@/images/projects/devdreaming.jpg";
import project3 from "@/images/projects/nft-collection-website-cover-image.jpg";
import project4 from "@/images/projects/fashion-studio-website.jpg";
import project5 from "@/images/projects/agency-website-cover-image.jpg";
import project6 from "@/images/projects/portfolio-cover-image.jpg";

export default function Page() {
  const projects = [
    {
      img: project1,
      title: "Crypto Screener Application",
      summary:
        "A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your local currency.",
      link: "/",
      github: "/",
      tags: "Back Office ReactJS",
    },
    {
      img: project2,
      title: "Portfolio",
      link: "/",
      github: "/",
      tags: "Web Site NextJS",
    },
    {
      img: project3,
      title: "Blog",
      link: "/",
      github: "/",
      tags: "Social Media AstroJS",
    },
    {
      title: "Marketplace",
      img: project4,
      summary:
        "A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth page transitions, cool background effects, unique design and it is mobile responsive.",
      link: "/",
      github: "/",
      tags: "Ecommerce Ruby on Rails",
    },
    {
      img: project5,
      title: "React Portfolio Website",
      link: "/",
      github: "/",
      tags: "Featured Project",
    },
    {
      img: project6,
      title: "React Portfolio Website",
      link: "/",
      github: "/",
      tags: "Featured Project",
    },
  ];

  return (
    <div
      className="grid grid-cols-12
      gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0"
    >
      {projects.map(({ img, title, summary, link, github, tags }, index) =>
        index % 3 === 0 ? (
          <div key={index} className="col-span-12">
            <FeaturedProject
              img={img}
              title={title}
              summary={summary}
              link={link}
              github={github}
              tags={tags}
            />
          </div>
        ) : (
          <div key={index} className="col-span-6 sm:col-span-12">
            <Project
              key={index}
              img={img}
              title={title}
              link={link}
              github={github}
              tags={tags}
            />
          </div>
        ),
      )}
    </div>
  );
}
