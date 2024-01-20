import "./styles.css";

import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows/_index";
import { GitHubIcon } from "@/atoms/icons/_index";
import { FramerImage } from "@/hoc/_index";

export const Project = ({ props }) => {
  const { tags, title, img, link, github } = props;

  const appLinkLegend = "Visit";

  return (
    <article className="project">
      <BoxShadow />

      <Link href={link} target="_blank" className="project_image-link">
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

        <Link href={link} target="_blank" className="project_title-link">
          <h2 className="project_title">{title}</h2>
        </Link>

        <div className="project_demo-grid">
          <Link href={link} target="_blank" className="project_app-link">
            {appLinkLegend}
          </Link>

          <Link href={github} target="_blank" className="project_repo-link">
            <GitHubIcon />
          </Link>
        </div>
      </div>
    </article>
  );
};
