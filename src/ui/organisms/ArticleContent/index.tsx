"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import type { Article } from "@/domains/article";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import SocialShareButtons from "@/molecules/SocialShareButtons";
import { CodeBlock } from "./CodeBlock";
import "./styles.css";

export interface ArticleContentProps {
  article: Article;
}

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["a", "code"],
  ALLOWED_ATTR: ["href", "title", "target", "rel", "class"],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/|#)/i,
};

const formatInlineContent = (line: string): string => {
  const withInlineCode = line.replace(
    /`([^`]+)`/g,
    '<code class="article-content__inline-code">$1</code>'
  );

  const withLinks = withInlineCode.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
  );

  return DOMPurify.sanitize(withLinks, SANITIZE_CONFIG);
};

const renderContent = (content: string): React.ReactNode[] => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";
  let key = 0;
  let listItems: string[] = [];

  const pushElement = (element: React.ReactNode) => {
    elements.push(<React.Fragment key={key++}>{element}</React.Fragment>);
  };

  const flushListItems = () => {
    if (listItems.length > 0) {
      pushElement(
        <ul className="article-content__list">
          {listItems.map((item, idx) => (
            <li key={idx} className="article-content__list-item">
              {item}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```") && !inCodeBlock) {
      flushListItems();
      inCodeBlock = true;
      codeLanguage = line.slice(3).trim() || "text";
      codeContent = "";
      continue;
    }

    if (line.startsWith("```") && inCodeBlock) {
      inCodeBlock = false;
      pushElement(
        <CodeBlock code={codeContent.trim()} language={codeLanguage} />
      );
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    if (line.trim() === "") {
      flushListItems();
      continue;
    }

    if (line.startsWith("# ")) {
      flushListItems();
      pushElement(
        <h1 className="article-content__heading article-content__heading--h1">
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushListItems();
      pushElement(
        <h2 className="article-content__heading article-content__heading--h2">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushListItems();
      pushElement(
        <h3 className="article-content__heading article-content__heading--h3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    flushListItems();

    const processedLine = formatInlineContent(line);

    pushElement(
      <p
        className="article-content__paragraph"
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
  }

  flushListItems();

  return elements;
};

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  const shouldReduceMotion = useReducedMotion();

  // Build absolute URL on client side for social sharing
  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/articles/${article.slug}`
      : "";

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
        },
      },
    }),
    [shouldReduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: shouldReduceMotion ? 0 : 0.5 },
      },
    }),
    [shouldReduceMotion]
  );

  return (
    <m.article
      className="article-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="article-title"
    >
      <m.header className="article-content__header" variants={itemVariants}>
        <h1 id="article-title" className="article-content__title">
          {article.title}
        </h1>

        <div className="article-content__meta">
          <time
            className="article-content__date"
            dateTime={article.published_at}
          >
            {new Date(article.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span
            className="article-content__reading-time"
            aria-label="Reading time"
          >
            {article.reading_time}
          </span>
        </div>

        {articleUrl && (
          <div className="article-content__share">
            <SocialShareButtons url={articleUrl} title={article.title} />
          </div>
        )}
      </m.header>

      {article.img && (
        <m.figure
          className="article-content__featured-image"
          variants={itemVariants}
        >
          <Image
            src={article.img}
            alt={`Featured image for ${article.title}`}
            className="article-content__image"
            width={800}
            height={400}
            priority
          />
        </m.figure>
      )}

      <m.div className="article-content__body" variants={itemVariants}>
        {article.content ? (
          renderContent(article.content)
        ) : (
          <p className="article-content__summary">{article.summary}</p>
        )}
      </m.div>

      <m.footer className="article-content__footer" variants={itemVariants}>
        <Link href="/articles" className="article-content__back-link">
          ← Back to Articles
        </Link>
      </m.footer>
    </m.article>
  );
};

export default ArticleContent;
