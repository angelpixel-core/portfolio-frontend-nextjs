import "./styles.css";
import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows";
import { GitHubIcon } from "@/atoms/icons";
import { FramerImage } from "@/atoms/hocs";

export const FeaturedProject = ({
  tags,
  title,
  summary,
  img,
  demo,
  repository,
}) => {
  const appLinkLegend = "Visit Project";

  return (
    <article className="project--featured">
      <BoxShadow />

      <a
        href={demo}
        target="_blank"
        rel="noopener noreferrer"
        className="project_image-link--feat"
      >
        <FramerImage
          src={img}
          alt={title}
          width={800}
          height={450}
          className="project_image--feat"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          priority
          sizes="
            (max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            50vw
          "
        />
      </a>

      <div className="project_info-grid--feat">
        <span className="project_tags">{tags}</span>

        <Link href={demo} target="_blank" className="project_title-link">
          <h2 className="project_title--feat">{title}</h2>
        </Link>

        <p className="project_description--feat">{summary}</p>

        <div className="project_demo-grid--feat">
          <Link
            href={repository}
            target="_blank"
            className="project_repo-link--feat"
          >
            <GitHubIcon />
          </Link>

          <Link href={demo} target="_blank" className="project_app-link--feat">
            {appLinkLegend}
          </Link>
        </div>
      </div>
    </article>
  );
};
