import { fetchProjects } from "@/lib/data/_index";

// import { Project, FeaturedProject } from "@/molecules/projects/_index";

export default function Page() {
  // const projects = fetchProjects();

  return (
    <div className="projects-content">
      <h3>ArticlesPage</h3>
      {/*
      {projects.map((project, index) =>
        project.featured ? (
          <div key={index} className="project_container--feat">
            <FeaturedProject props={project} />
          </div>
        ) : (
          <div key={index} className="project_container">
            <Project key={index} props={project} />
          </div>
        ),
      )}
      */}
    </div>
  );
}
