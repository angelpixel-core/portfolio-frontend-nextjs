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
  // Group into blade pairs: each featured project + its non-featured neighbours
  const { filteredProjects, bladePairs } = useMemo(() => {
    const filtered =
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
    const featured = limited.filter((p) => p.featured);
    const nonFeatured = limited.filter((p) => !p.featured);

    // Build blade pairs: each featured gets an even share of non-featured
    let pairs: { featured: (typeof limited)[0] | null; grid: typeof limited }[];

    if (featured.length === 0) {
      pairs = [{ featured: null, grid: nonFeatured }];
    } else {
      const perBlade = Math.ceil(nonFeatured.length / featured.length);
      pairs = featured.map((fp, i) => ({
        featured: fp,
        grid: nonFeatured.slice(i * perBlade, (i + 1) * perBlade),
      }));
    }

    return { filteredProjects: limited, bladePairs: pairs };
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
    <div className="projects-page" data-testid="projects-page">
      {bladePairs.map((blade, bladeIndex) => (
        <div key={blade.featured?.slug || `blade-${bladeIndex}`}>
          {/* Hero Blade: Featured Project (first blade includes title + filter) */}
          <section
            className={`projects-blade ${
              bladeIndex === 0
                ? "projects-blade--hero"
                : "projects-blade--hero projects-blade--secondary"
            }`}
            data-testid={
              bladeIndex === 0
                ? "projects-hero-blade"
                : "projects-secondary-blade"
            }
          >
            {bladeIndex === 0 && (
              <>
                <MotionTitle title={title} className="projects-title" />

                <div
                  className="projects-blade__filter-wrapper"
                  data-testid="projects-filter-wrapper"
                >
                  <TechnologyFilter
                    technologies={allTechnologies}
                    selected={selectedTechs}
                    onToggle={toggleTech}
                    onClearAll={clearAllFilters}
                  />

                  {selectedTechs.length > 0 && (
                    <p className="projects-count" data-testid="projects-count">
                      Showing {Math.min(filteredProjects.length, totalFiltered)}{" "}
                      of {totalFiltered} projects
                      {totalFiltered > MAX_PROJECTS &&
                        ` (max ${MAX_PROJECTS} shown)`}
                    </p>
                  )}
                </div>

                {filteredProjects.length === 0 && (
                  <p className="projects-empty" data-testid="projects-empty">
                    No projects match the selected filters.
                  </p>
                )}
              </>
            )}

            {blade.featured && (
              <div className="projects-blade__featured">
                <ProjectCard project={blade.featured} />
              </div>
            )}
          </section>

          {/* Grid Blade: Non-featured Projects */}
          {blade.grid.length > 0 && (
            <section
              className="projects-blade projects-blade--grid"
              data-testid="projects-grid-blade"
            >
              <div className="projects-grid" data-testid="projects-grid">
                {blade.grid.map((project) => (
                  <div
                    key={project.slug}
                    className="projects-grid__item"
                    data-testid="projects-grid-item"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ))}
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
