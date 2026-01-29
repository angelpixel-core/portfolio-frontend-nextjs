/**
 * @deprecated Use ProjectCard from @/ui/organisms/ProjectCard instead.
 * This component is kept for reference only.
 * Migration: import { GridProjectCard } from "@/ui/organisms/ProjectCard"
 */
import "./styles.css";
import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows";
import { GitHubIcon } from "@/atoms/icons";
import { FramerImage } from "@/atoms/hocs";

export const Project = ({ slug, tags, title, img, demo, repository }) => {
  const appLinkLegend = "Visit";
  const detailUrl = `/projects/${slug}`;

  return (
    <article className="project">
      <BoxShadow />

      <Link href={detailUrl} className="project_image-link">
        <FramerImage
          src={img}
          alt={title}
          width={600}
          height={400}
          className="project_image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="project_info-grid">
        <span className="project_tags">{tags}</span>

        <Link href={detailUrl} className="project_title-link">
          <h2 className="project_title">{title}</h2>
        </Link>

        <div className="project_demo-grid">
          {demo && (
            <Link
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project_app-link"
            >
              {appLinkLegend}
            </Link>
          )}

          {repository && (
            <Link
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              className="project_repo-link"
            >
              <GitHubIcon />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
