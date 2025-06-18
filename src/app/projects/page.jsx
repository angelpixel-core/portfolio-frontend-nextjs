import { Project } from "@/models";
import { Project as DefaultProject, FeaturedProject } from "@/molecules";

export default async function ProjectsPage() {
  const projects = await Project.all();

  return (
    <div className="projects-content">
      {projects.map((project, index) =>
        project.featured ? (
          <div key={index} className="project_container--feat">
            <FeaturedProject key={index} {...project} />
          </div>
        ) : (
          <div key={index} className="project_container">
            <DefaultProject key={index} {...project} />
          </div>
        )
      )}
    </div>
  );
}
