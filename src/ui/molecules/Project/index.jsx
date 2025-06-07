import "./styles.css";

import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows/_index";
import { GitHubIcon } from "@/atoms/icons/_index";
import { FramerImage } from "@/atoms/hocs/_index";

export const Project = ({ tags, title, img, demo, repository }) => {
  const appLinkLegend = "Visit";

  return (
    <article className="project">
      <BoxShadow />

      <Link href={demo} target="_blank" className="project_image-link">
        <FramerImage
          src={img}
          alt={title}
          className="project_image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

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
