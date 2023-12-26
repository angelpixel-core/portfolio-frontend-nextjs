import { fetchProjects } from "@/data/projects";

import Project from "@/molecules/projects/project";
import FeaturedProject from "@/molecules/projects/featured-project";

export default function Page() {
  const projects = fetchProjects();

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
