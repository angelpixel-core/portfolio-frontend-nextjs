import Link from "next/link";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import type { ProjectCardVariantProps } from "../ProjectCard.types";

/**
 * Grid variant of ProjectCard for non-featured projects.
 * Displays a compact card suitable for grid layouts.
 */
export function GridProjectCard({
  project,
  className = "",
}: ProjectCardVariantProps) {
  const { slug, title, img, tags, technologies, demo, repository } = project;
  const detailUrl = `/projects/${slug}`;

  return (
    <article className={`project-card project-card--grid ${className}`.trim()}>
      <BoxShadow />

      <Link href={detailUrl} className="project-card__image-link">
        <FramerImage
          src={img}
          alt={title}
          width={600}
          height={400}
          className="project-card__image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="project-card__content">
        <span className="project-card__tags">{tags}</span>

        <Link href={detailUrl} className="project-card__title-link">
          <h2 className="project-card__title">{title}</h2>
        </Link>

        <TechStackIcons technologies={technologies} />

        <ActionLinks
          demo={demo}
          repository={repository}
          projectTitle={title}
        />
      </div>
    </article>
  );
}
