import "./styles.css";

import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows/_index";
import { GithubIcon } from "@/atoms/icons/_index";
import { FramerImage } from "@/hoc/_index";

export const FeaturedProject = ({ props }) => {
  const { tags, title, summary, img, link, github } = props;

  const appLinkLegend = "Visit Project";

  return (
    <article className="project--featured">
      <BoxShadow />

      <Link href={link} target="_blank" className="project_image-link--feat">
        <FramerImage
          src={img}
          alt={title}
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
      </Link>

      <div className="project_info-grid--feat">
        <span className="project_tags">{tags}</span>

        <Link href={link} target="_blank" className="project_title-link">
          <h2 className="project_title--feat">{title}</h2>
        </Link>

        <p className="project_description--feat">{summary}</p>

        <div className="project_demo-grid--feat">
          <Link
            href={github}
            target="_blank"
            className="project_repo-link--feat"
          >
            <GithubIcon />
          </Link>

          <Link href={link} target="_blank" className="project_app-link--feat">
            {appLinkLegend}
          </Link>
        </div>
      </div>
    </article>
  );
};
