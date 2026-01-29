import Link from "next/link";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import type { ProjectCardVariantProps } from "../ProjectCard.types";

/**
 * Featured variant of ProjectCard for highlighted projects.
 * Displays a larger card with summary text, suitable for blade layouts.
 */
export function FeaturedProjectCard({
  project,
  className = "",
}: ProjectCardVariantProps) {
  const { slug, title, summary, img, tags, technologies, demo, repository } =
    project;
  const detailUrl = `/projects/${slug}`;

  return (
    <article
      className={`project-card project-card--featured ${className}`.trim()}
    >
      <BoxShadow />

      <Link href={detailUrl} className="project-card__image-link--featured">
        <FramerImage
          src={img}
          alt={title}
          width={800}
          height={450}
          className="project-card__image--featured"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        />
      </Link>

      <div className="project-card__content--featured">
        <span className="project-card__tags">{tags}</span>

        <Link href={detailUrl} className="project-card__title-link">
          <h2 className="project-card__title--featured">{title}</h2>
        </Link>

        <p className="project-card__summary">{summary}</p>

        <TechStackIcons technologies={technologies} />

        <ActionLinks demo={demo} repository={repository} projectTitle={title} />
      </div>
    </article>
  );
}
