import React from "react";

import "./styles.css";

import Link from "next/link";

import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";

interface FeaturedArticleInnerProps {
  img: string;
  title: string;
  time: string;
  summary: string;
  link: string;
}

interface FeaturedArticleProps {
  props: FeaturedArticleInnerProps;
}

export const FeaturedArticle = ({
  props,
}: FeaturedArticleProps): React.JSX.Element => {
  const { img, title, time, summary, link } = props;

  return (
    <article className="article--feat">
      <BoxShadow />

      <Link href={link} target="_blank" className="article__image-link--feat">
        <FramerImage
          src={img}
          alt={title}
          className="article__image--feat"
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
        <h2 className="article__title--feat">{title}</h2>
      </Link>

      <p className="article__description--feat">{summary}</p>

      <span className="article__reading-time--feat">{time}</span>
    </article>
  );
};
