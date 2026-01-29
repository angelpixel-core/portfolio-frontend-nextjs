"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjects } from "@/hooks";
import { TechnologyFilter } from "@/molecules";
import { ProjectCard } from "@/organisms/ProjectCard";
import { getUniqueTechnologies } from "@/domains/project/model/utils";
import ProjectListSkeleton from "./ProjectListSkeleton";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: projects = [], isLoading, isError } = useProjects();

  // Get selected technologies from URL
  const selectedTechs = useMemo(() => {
    return searchParams.getAll("tech");
  }, [searchParams]);

  // Get unique technologies for filter options
  const allTechnologies = useMemo(() => {
    return getUniqueTechnologies(projects);
  }, [projects]);

  // Update URL when filter changes
  const toggleTech = useCallback(
    (tech: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentTechs = params.getAll("tech");

      if (currentTechs.includes(tech)) {
        // Remove tech
        params.delete("tech");
        currentTechs
          .filter((t) => t !== tech)
          .forEach((t) => params.append("tech", t));
      } else {
        // Add tech
        params.append("tech", tech);
      }

      const queryString = params.toString();
      router.push(queryString ? `/projects?${queryString}` : "/projects", {
        scroll: false,
      });
    },
    [searchParams, router]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    router.push("/projects", { scroll: false });
  }, [router]);

  // Filter projects (OR logic)
  const filteredProjects = useMemo(() => {
    if (selectedTechs.length === 0) return projects;
    return projects.filter((project) =>
      project.technologies.some((tech) => selectedTechs.includes(tech))
    );
  }, [projects, selectedTechs]);

  if (isLoading) {
    return <ProjectListSkeleton />;
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
      <TechnologyFilter
        technologies={allTechnologies}
        selected={selectedTechs}
        onToggle={toggleTech}
        onClearAll={clearAllFilters}
      />

      {selectedTechs.length > 0 && (
        <p className="projects-count">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      )}

      {filteredProjects.length === 0 ? (
        <p className="projects-empty">
          No projects match the selected filters.
        </p>
      ) : (
        filteredProjects.map((project) => (
          <div
            key={project.slug}
            className={
              project.featured
                ? "project_container--feat"
                : "project_container"
            }
          >
            <ProjectCard project={project} />
          </div>
        ))
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ProjectsContent />
    </Suspense>
  );
}
