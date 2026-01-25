"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/domains/article";
import { useReducedMotion } from "@/hooks";
import { CodeBlock } from "./CodeBlock";
import "./styles.css";

export interface ArticleContentProps {
  article: Article;
}

/**
 * Parse markdown content and render with proper formatting
 * Handles headings, paragraphs, code blocks, and lists
 */
const renderContent = (content: string): React.ReactNode[] => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";
  let key = 0;

  const pushElement = (element: React.ReactNode) => {
    elements.push(<React.Fragment key={key++}>{element}</React.Fragment>);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block start
    if (line.startsWith("```") && !inCodeBlock) {
      inCodeBlock = true;
      codeLanguage = line.slice(3).trim() || "text";
      codeContent = "";
      continue;
    }

    // Code block end
    if (line.startsWith("```") && inCodeBlock) {
      inCodeBlock = false;
      pushElement(
        <CodeBlock code={codeContent.trim()} language={codeLanguage} />
      );
      continue;
    }

    // Inside code block
    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      pushElement(
        <h1 className="article-content__heading article-content__heading--h1">
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      pushElement(
        <h2 className="article-content__heading article-content__heading--h2">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      pushElement(
        <h3 className="article-content__heading article-content__heading--h3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // List items
    if (line.startsWith("- ")) {
      pushElement(
        <li className="article-content__list-item">{line.slice(2)}</li>
      );
      continue;
    }

    // Inline code
    const inlineCodeRegex = /`([^`]+)`/g;
    const processedLine = line.replace(
      inlineCodeRegex,
      '<code class="article-content__inline-code">$1</code>'
    );

    // Regular paragraph
    pushElement(
      <p
        className="article-content__paragraph"
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
  }

  return elements;
};

export const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.5 },
    },
  };

  return (
    <motion.article
      className="article-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="article-title"
    >
      <motion.header
        className="article-content__header"
        variants={itemVariants}
      >
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
      </motion.header>

      {article.img && (
        <motion.figure
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
        </motion.figure>
      )}

      <motion.div className="article-content__body" variants={itemVariants}>
        {article.content ? (
          renderContent(article.content)
        ) : (
          <p className="article-content__summary">{article.summary}</p>
        )}
      </motion.div>

      <motion.footer
        className="article-content__footer"
        variants={itemVariants}
      >
        <Link href="/articles" className="article-content__back-link">
          ← Back to Articles
        </Link>
      </motion.footer>
    </motion.article>
  );
};

export default ArticleContent;
