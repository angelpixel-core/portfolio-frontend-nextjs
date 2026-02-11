"use client";

import "./styles.css";

import { m } from "framer-motion";

import { MovingImage } from "../MovingImage";

export interface ArticleProps {
  img: string;
  title: string;
  date: string;
  link: string;
}

interface ArticleComponentProps {
  props: ArticleProps;
}

export const Article = ({ props }: ArticleComponentProps) => {
  const { img, title, date, link } = props;

  return (
    <m.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      viewport={{ once: true }}
      className="relative w-full px-4 py-6 rounded-xl flex items-center justify-between bg-light text-dark first:mt-0 border border-solid border-dark border-r-4 border-b-4"
    >
      <MovingImage title={title} img={img} link={link} />

      <span className="article_publish-date">{date}</span>
    </m.li>
  );
};
