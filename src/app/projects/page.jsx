import Project from "@/components/ui/projects/project";
import FeaturedProject from "@/components/ui/projects/featured-project";

import project1 from "@/images/projects/crypto-screener-cover-image.jpg";
import project2 from "@/images/projects/devdreaming.jpg";
import project3 from "@/images/projects/nft-collection-website-cover-image.jpg";
import project4 from "@/images/projects/fashion-studio-website.jpg";
import project5 from "@/images/projects/agency-website-cover-image.jpg";
import project6 from "@/images/projects/portfolio-cover-image.jpg";

export default function Page() {
  return (
    <div className="grid grid-cols-12 gap-x-24 gap-y-32">
      <div className="col-span-12">
        <FeaturedProject
          img={project1}
          title="Crypto Screener Application"
          summary="A feature-rich Crypto Screener App using React, Tailwind CSS,
          Context API, React Router and Recharts. It shows detail regarding
          almost all the cryptocurrency. You can easily convert the price in
          your local currency."
          link="/"
          github="/"
          type="Featured Project"
        />
      </div>
      <div className="col-span-6">
        <Project
          img={project2}
          title="React Portfolio Website"
          link="/"
          github="/"
          type="Featured Project"
        />
      </div>
      <div className="col-span-6">
        <Project
          img={project3}
          title="React Portfolio Website"
          link="/"
          github="/"
          type="Featured Project"
        />
      </div>
      <div className="col-span-12">
        <FeaturedProject
          title="React Portfolio Website"
          img={project4}
          summary="A professional portfolio website using React JS,
          Framer-motion, and Styled-components. It has smooth page transitions,
          cool background effects, unique design and it is mobile responsive."
          link="/"
          github="/"
          type="Featured Project"
        />
      </div>
      <div className="col-span-6">
        <Project
          img={project5}
          title="React Portfolio Website"
          link="/"
          github="/"
          type="Featured Project"
        />
      </div>
      <div className="col-span-6">
        <Project
          img={project6}
          title="React Portfolio Website"
          link="/"
          github="/"
          type="Featured Project"
        />
      </div>
    </div>
  );
}
