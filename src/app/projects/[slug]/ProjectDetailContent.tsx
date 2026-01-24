"use client";

import Image from "next/image";
import type { ProjectModel } from "@/domains/project/model/schema";

interface Props {
  project: ProjectModel;
}

export default function ProjectDetailContent({ project }: Props) {
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
        <div className="project-detail__description">
          <h2>About this project</h2>
          <p>{project.description}</p>
        </div>

        <div className="project-detail__technologies">
          <h2>Technologies Used</h2>
          <ul className="project-detail__tech-list">
            {project.technologies.map((tech, index) => (
              <li key={index} className="project-detail__tech-item">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {project.outcomes && (
          <div className="project-detail__outcomes">
            <h2>Outcomes</h2>
            <p>{project.outcomes}</p>
          </div>
        )}

        {project.screenshots && project.screenshots.length > 0 && (
          <div className="project-detail__screenshots">
            <h2>Screenshots</h2>
            <div className="project-detail__gallery">
              {project.screenshots.map((screenshot, index) => (
                <Image
                  key={index}
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
          >
            View Repository
          </a>
        )}
      </footer>
    </article>
  );
}
