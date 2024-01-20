import { fetchProjects } from "@/lib/data/_index";

import { Project, FeaturedProject } from "@/molecules/projects/_index";

export default async function Page() {
  const projects = await fetchProjects();

  return (
    <div className="projects-content">
      {projects.map((project, index) =>
        project.featured ? (
          <div key={index} className="project_container--feat">
            <FeaturedProject props={project} />
          </div>
        ) : (
          <div key={index} className="project_container">
            <Project key={index} props={project} />
          </div>
        )
      )}
    </div>
  );
}
