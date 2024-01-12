import "./styles.css";

import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows/_index";
import { GithubIcon } from "@/atoms/icons/_index";
import { FramerImage } from "@/hoc/_index";

export const FeaturedArticle = ({ props }) => {
  const { img, title, time, summary, link } = props;

  return (
    <article className="article--feat">
      <BoxShadow />

      <Link href={link} target="_blank" className="article_image-link--feat">
        <FramerImage
          src={img}
          alt={title}
          className="article_image--feat"
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

      <Link href={link} target="_blank">
        <h2 className="article_title--feat">{title}</h2>
      </Link>

      <p className="article_description--feat">{summary}</p>

      <span className="article_reading-time--feat">{time}</span>
    </article>
  );
};
