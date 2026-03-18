"use client";

import "./styles.css";

import { useEffect } from "react";
import Image from "next/image";
import type { ProjectModel } from "@/domains/project/model/schema";
import { trackEvent } from "@/services/analytics";

interface ProjectDetailProps {
  project: ProjectModel;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  useEffect(() => {
    trackEvent("project_view", { slug: project.slug });
  }, [project.slug]);

  const handleDemoClick = () => {
    if (!project.demo) return;
    trackEvent("project_demo_click", {
      href: project.demo,
      slug: project.slug,
    });
  };

  const handleRepositoryClick = () => {
    if (!project.repository) return;
    trackEvent("project_architecture_click", {
      href: project.repository,
      slug: project.slug,
      label: "repository",
    });
  };

  return (
    <article className="project-detail">
      <header className="project-detail__header">
        <h1 className="project-detail__title">{project.title}</h1>
        <p className="project-detail__tags">{project.tags}</p>
      </header>

      <div className="project-detail__image-container">
        <Image
          src={project.img}
          alt={`${project.title} preview`}
          width={896}
          height={504}
          className="project-detail__image"
          priority
        />
      </div>

      <section className="project-detail__content">
        <div className="project-detail__editorial-grid">
          <div className="project-detail__main-column">
            <div className="project-detail__description project-detail__panel project-detail__panel--about">
              <h2>About this project</h2>
              <p>{project.description}</p>
            </div>

            {project.outcomes && (
              <div className="project-detail__outcomes project-detail__panel project-detail__panel--outcomes">
                <h2>Outcomes</h2>
                <p>{project.outcomes}</p>
              </div>
            )}
          </div>

          <aside
            className="project-detail__aside-column"
            aria-label="Technical project details"
          >
            <div className="project-detail__technical-highlights project-detail__panel project-detail__panel--highlights">
              <h2>Technical Highlights</h2>
              <ul className="project-detail__highlights-list">
                {(
                  project.technicalHighlights ??
                  project.technologies.slice(0, 4)
                ).map((highlight) => (
                  <li
                    key={highlight}
                    className="project-detail__highlight-item"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="project-detail__technologies project-detail__panel project-detail__panel--stack">
              <h2>Tech Stack</h2>
              <ul className="project-detail__stack-list">
                {project.technologies.map((tech) => (
                  <li key={tech} className="project-detail__stack-item">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {project.screenshots && project.screenshots.length > 0 && (
          <div className="project-detail__screenshots project-detail__panel project-detail__panel--screenshots">
            <h2>Screenshots</h2>
            <div className="project-detail__gallery">
              {project.screenshots.map((screenshot, index) => (
                <Image
                  key={screenshot}
                  src={screenshot}
                  alt={`${project.title} screenshot ${index + 1}`}
                  width={448}
                  height={252}
                  className="project-detail__screenshot"
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="project-detail__links">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="project-detail__link project-detail__link--demo"
            onClick={handleDemoClick}
          >
            View Demo
          </a>
        )}
        {project.repository && (
          <a
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="project-detail__link project-detail__link--repo"
            onClick={handleRepositoryClick}
          >
            View Repository
          </a>
        )}
      </footer>
    </article>
  );
};

export default ProjectDetail;
