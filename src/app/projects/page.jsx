import { Project } from "@/models/_index";
import { Project as DefaultProject, FeaturedProject } from "@/molecules/_index";

export default async function Page() {
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
