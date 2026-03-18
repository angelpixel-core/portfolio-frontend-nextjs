"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjects } from "@/domains/project/queries";
import type { ProjectModel } from "@/domains/project/model/schema";
import TechnologyFilter from "@/molecules/TechnologyFilter";
import { ProjectCard } from "@/organisms/ProjectCard";
import MotionTitle from "@/atoms/texts/AnimatedTitle/MotionTitle";
import ProjectListSkeleton from "./ProjectListSkeleton";

/** Maximum number of projects to display (FR14.1) */
const PAGE_SIZE = 6;
const MAX_PROJECTS = PAGE_SIZE;

const PROJECT_FILTER_CHIPS = [
  "Ruby",
  "Rails",
  "Node.js",
  "TypeScript",
  "React",
  "Next.js",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Solidity",
  "Tailwind",
  "Docker",
] as const;

const normalizeTech = (value: string): string => {
  const compact = value.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (compact === "tailwind" || compact === "tailwindcss") return "tailwind";
  if (compact === "postgres" || compact === "postgresql") return "postgresql";

  return compact;
};

const projectMatchesSelectedTechs = (
  technologies: string[],
  selectedTechs: string[]
): boolean => {
  if (selectedTechs.length === 0) return true;

  const selected = new Set(selectedTechs.map(normalizeTech));
  return technologies.some((tech) => selected.has(normalizeTech(tech)));
};

const parsePageParam = (value: string | null): number => {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
};

const isIncomingProject = (project: ProjectModel): boolean => {
  const label = project.featuredCard?.ribbon?.text?.trim()?.toLowerCase();
  return label === "incoming";
};

const getOrderedProjects = (projects: ProjectModel[]): ProjectModel[] => {
  const featured: ProjectModel[] = [];
  const incoming: ProjectModel[] = [];
  const standard: ProjectModel[] = [];

  projects.forEach((project) => {
    if (project.featured) featured.push(project);
    else if (isIncomingProject(project)) incoming.push(project);
    else standard.push(project);
  });

  return [...featured, ...incoming, ...standard];
};

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: projects = [], isLoading, isError } = useProjects();
  const page = useMemo(
    () => parsePageParam(searchParams.get("page")),
    [searchParams]
  );

  // Get selected technologies from URL
  const selectedTechs = useMemo(() => {
    return searchParams.getAll("tech");
  }, [searchParams]);

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

  const totalFiltered = useMemo(() => {
    const filtered =
      selectedTechs.length === 0
        ? projects
        : projects.filter((project) =>
            projectMatchesSelectedTechs(project.technologies, selectedTechs)
          );
    return getOrderedProjects(filtered).length;
  }, [projects, selectedTechs]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  }, [totalFiltered]);

  const pageSliceStart = useMemo(() => (page - 1) * PAGE_SIZE, [page]);
  const pageSliceEnd = useMemo(
    () => pageSliceStart + PAGE_SIZE,
    [pageSliceStart]
  );
  const maxProjects = Math.min(
    MAX_PROJECTS,
    pageSliceEnd - pageSliceStart,
    totalPages * PAGE_SIZE
  );

  // Filter projects (OR logic) and limit to MAX_PROJECTS (AC5)
  // Group into blade pairs: each featured project + its non-featured neighbours
  const { filteredProjects, bladePairs } = useMemo(() => {
    const filtered =
      selectedTechs.length === 0
        ? projects
        : projects.filter((project) =>
            projectMatchesSelectedTechs(project.technologies, selectedTechs)
          );

    // Sort to prioritize featured projects, then limit (AC5)
    const sorted = [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    const limited = sorted.slice(0, maxProjects);
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
  }, [projects, selectedTechs, maxProjects]);

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
                    technologies={[...PROJECT_FILTER_CHIPS]}
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
