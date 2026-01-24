import "./styles.css";
import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows";
import { GitHubIcon } from "@/atoms/icons";
import { FramerImage } from "@/atoms/hocs";

export const Project = ({ tags, title, img, demo, repository }) => {
  const appLinkLegend = "Visit";

  return (
    <article className="project">
      <BoxShadow />

      <a
        href={demo}
        target="_blank"
        rel="noopener noreferrer"
        className="project_image-link"
      >
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
      </a>

      <div className="project_info-grid">
        <span className="project_tags">{tags}</span>

        <Link href={demo} target="_blank" className="project_title-link">
          <h2 className="project_title">{title}</h2>
        </Link>

        <div className="project_demo-grid">
          <Link href={demo} target="_blank" className="project_app-link">
            {appLinkLegend}
          </Link>

          <Link href={repository} target="_blank" className="project_repo-link">
            <GitHubIcon />
          </Link>
        </div>
      </div>
    </article>
  );
};
