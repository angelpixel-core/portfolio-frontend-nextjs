"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjects } from "@/hooks";
import { TechnologyFilter } from "@/molecules";
import { ProjectCard } from "@/organisms/ProjectCard";
import MotionTitle from "@/atoms/texts/AnimatedTitle/MotionTitle";
import { getUniqueTechnologies } from "@/domains/project/model/utils";
import ProjectListSkeleton from "./ProjectListSkeleton";

/** Maximum number of projects to display (FR14.1) */
const MAX_PROJECTS = 6;

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

  // Filter projects (OR logic) and limit to MAX_PROJECTS (AC5)
  // Featured projects are prioritized in the limit
  const { filteredProjects, featuredProject, nonFeaturedProjects } =
    useMemo(() => {
      let filtered =
        selectedTechs.length === 0
          ? projects
          : projects.filter((project) =>
              project.technologies.some((tech) => selectedTechs.includes(tech))
            );

      // Sort to prioritize featured projects, then limit (AC5)
      const sorted = [...filtered].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });

      const limited = sorted.slice(0, MAX_PROJECTS);
      const featured = limited.find((p) => p.featured) || null;
      const nonFeatured = limited.filter((p) => !p.featured);

      return {
        filteredProjects: limited,
        featuredProject: featured,
        nonFeaturedProjects: nonFeatured,
      };
    }, [projects, selectedTechs]);

  if (isLoading) {
    return <ProjectListSkeleton />;
  }

  if (isError || !projects.length) {
    return (
      <div className="projects-content">
        <p className="projects-empty">No projects available.</p>
      </div>
    );
  }

  const totalFiltered =
    selectedTechs.length === 0
      ? projects.length
      : projects.filter((project) =>
          project.technologies.some((tech) => selectedTechs.includes(tech))
        ).length;

  const title = "Imagination Trumps Knowledge!";

  return (
    <div className="projects-page">
      {/* Hero Blade: Title + Filter + Featured Project (AC1, AC2, AC6) */}
      <section className="projects-blade projects-blade--hero">
        <MotionTitle title={title} className="projects-title" />

        <div className="projects-blade__filter-wrapper">
          <TechnologyFilter
            technologies={allTechnologies}
            selected={selectedTechs}
            onToggle={toggleTech}
            onClearAll={clearAllFilters}
          />

          {selectedTechs.length > 0 && (
            <p className="projects-count">
              Showing {Math.min(filteredProjects.length, totalFiltered)} of{" "}
              {totalFiltered} projects
              {totalFiltered > MAX_PROJECTS && ` (max ${MAX_PROJECTS} shown)`}
            </p>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <p className="projects-empty">
            No projects match the selected filters.
          </p>
        ) : (
          featuredProject && (
            <div className="projects-blade__featured">
              <ProjectCard project={featuredProject} />
            </div>
          )
        )}
      </section>

      {/* Grid Blade: Non-featured Projects (AC3) */}
      {nonFeaturedProjects.length > 0 && (
        <section className="projects-blade projects-blade--grid">
          <div className="projects-grid">
            {nonFeaturedProjects.map((project) => (
              <div key={project.slug} className="projects-grid__item">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
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
