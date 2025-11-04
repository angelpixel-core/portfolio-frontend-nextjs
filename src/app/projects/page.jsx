"use client";

import { useProjects } from "@/hooks";
import { Project as DefaultProject, FeaturedProject } from "@/molecules";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="projects-content">
        <p>Loading projects...</p>
      </div>
    );
  }

  if (isError || !projects.length) {
    return (
      <div className="projects-content">
        <p>No projects available.</p>
      </div>
    );
  }

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
