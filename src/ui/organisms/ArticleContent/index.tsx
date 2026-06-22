"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import sanitizeHtml from "sanitize-html";
import type { Article } from "@/domains/article";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import SocialShareButtons from "@/molecules/SocialShareButtons";
import { StealPatternCTA } from "@/molecules/Monetization";
import { trackEvent } from "@/observability/analytics";
import CopyButton from "@/buttons/CopyButton";
import { CodeBlock } from "./CodeBlock";
import "./styles.css";

export interface ArticleContentProps {
  article: Article;
}

const SANITIZE_CONFIG = {
  allowedTags: ["a", "code"],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    code: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const parseMarkdownLinks = (input: string): string => {
  let result = "";
  let cursor = 0;

  while (cursor < input.length) {
    const openBracketIndex = input.indexOf("[", cursor);

    if (openBracketIndex === -1) {
      result += input.slice(cursor);
      break;
    }

    result += input.slice(cursor, openBracketIndex);

    const closeBracketIndex = input.indexOf("]", openBracketIndex + 1);
    if (closeBracketIndex === -1 || input[closeBracketIndex + 1] !== "(") {
      result += input.slice(openBracketIndex, openBracketIndex + 1);
      cursor = openBracketIndex + 1;
      continue;
    }

    let urlIndex = closeBracketIndex + 2;
    let depth = 1;
    let url = "";

    while (urlIndex < input.length && depth > 0) {
      const currentChar = input[urlIndex];

      if (currentChar === "(") depth += 1;
      if (currentChar === ")") depth -= 1;

      if (depth > 0) {
        url += currentChar;
      }

      urlIndex += 1;
    }

    if (depth !== 0) {
      result += input.slice(openBracketIndex);
      break;
    }

    const label = input.slice(openBracketIndex + 1, closeBracketIndex);
    const normalizedUrl = url.trim();

    if (!normalizedUrl) {
      result += input.slice(openBracketIndex, urlIndex);
      cursor = urlIndex;
      continue;
    }

    result += `<a href="${escapeHtml(normalizedUrl)}" rel="noopener noreferrer" target="_blank">${escapeHtml(label)}</a>`;
    cursor = urlIndex;
  }

  return result;
};

const formatInlineContent = (line: string): string => {
  const processed = line
    .split(/(`[^`]*`)/g)
    .map((segment) => {
      if (
        segment.startsWith("`") &&
        segment.endsWith("`") &&
        segment.length >= 2
      ) {
        const codeContent = segment.slice(1, -1);
        return `<code class="article-content__inline-code">${escapeHtml(codeContent)}</code>`;
      }

      return parseMarkdownLinks(segment);
    })
    .join("");

  return sanitizeHtml(processed, SANITIZE_CONFIG);
};

const createHeadingId = (
  headingText: string,
  occurrences: Map<string, number>
): string => {
  const baseId =
    headingText
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section";

  const currentCount = occurrences.get(baseId) ?? 0;
  occurrences.set(baseId, currentCount + 1);

  return currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;
};

const renderContent = (content: string): React.ReactNode[] => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";
  let key = 0;
  let listItems: string[] = [];
  const headingOccurrences = new Map<string, number>();
  let skippedPrimaryHeading = false;
  let hasRenderedLeadParagraph = false;

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
      const headingText = line.slice(2);

      if (!skippedPrimaryHeading) {
        createHeadingId(headingText, headingOccurrences);
        skippedPrimaryHeading = true;
        continue;
      }

      const headingId = createHeadingId(headingText, headingOccurrences);
      pushElement(
        <h1
          id={headingId}
          className="article-content__heading article-content__heading--h1"
        >
          {headingText}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushListItems();
      const headingText = line.slice(3);
      const headingId = createHeadingId(headingText, headingOccurrences);
      pushElement(
        <h2
          id={headingId}
          className="article-content__heading article-content__heading--h2"
        >
          {headingText}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushListItems();
      const headingText = line.slice(4);
      const headingId = createHeadingId(headingText, headingOccurrences);
      pushElement(
        <h3
          id={headingId}
          className="article-content__heading article-content__heading--h3"
        >
          {headingText}
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
        className={`article-content__paragraph ${
          !hasRenderedLeadParagraph ? "article-content__paragraph--lead" : ""
        }`.trim()}
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
    hasRenderedLeadParagraph = true;
  }

  flushListItems();

  return elements;
};

const stripArticleImages = (content: string): string =>
  content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const renderArticleBlocks = (article: Article): React.ReactNode => {
  const blocks = article.blocks ?? [];

  if (blocks.length === 0) return null;

  return (
    <div className="article-content__blocks" data-testid="article-blocks">
      {blocks.map((block) => {
        if (block.block_type === "divider") {
          return <hr key={block.id} className="article-content__divider" />;
        }

        if (block.block_type === "image") {
          return (
            <figure key={block.id} className="article-content__block-figure">
              {block.image_url ? (
                <Image
                  src={block.image_url}
                  alt={block.image_alt ?? block.title ?? article.title}
                  className="article-content__block-image"
                  width={1200}
                  height={675}
                />
              ) : null}
              {block.caption ? (
                <figcaption className="article-content__block-caption">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.block_type === "code") {
          return (
            <section key={block.id} className="article-content__block">
              {block.title ? (
                <h2 className="article-content__heading article-content__heading--h2">
                  {block.title}
                </h2>
              ) : null}
              <CodeBlock code={block.body ?? ""} language="text" />
            </section>
          );
        }

        const content = block.body ? renderContent(block.body) : null;

        return (
          <section key={block.id} className="article-content__block">
            {block.title ? (
              <h2 className="article-content__heading article-content__heading--h2">
                {block.title}
              </h2>
            ) : null}
            {block.block_type === "quote" ? (
              <blockquote className="article-content__quote">
                {content}
              </blockquote>
            ) : block.block_type === "callout" ? (
              <aside className="article-content__callout">{content}</aside>
            ) : (
              content
            )}
          </section>
        );
      })}
    </div>
  );
};

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  const shouldReduceMotion = useReducedMotion();
  const [articleUrl, setArticleUrl] = useState("");

  useEffect(() => {
    trackEvent("article_view", { slug: article.slug });
  }, [article.slug]);

  useEffect(() => {
    setArticleUrl(`${window.location.origin}/articles/${article.slug}`);
  }, [article.slug]);

  const articleTags = useMemo(() => {
    const tags = [article.category, ...(article.badges ?? [])].filter(
      (value): value is string => Boolean(value)
    );
    return Array.from(new Set(tags));
  }, [article.badges, article.category]);

  const formattedDate = useMemo(() => {
    const date = new Date(article.published_at);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  }, [article.published_at]);

  const copyPayload = useMemo(() => {
    const content = article.content?.trim() || article.summary || "";
    const sanitizedContent = stripArticleImages(content);
    const tagsLine = articleTags.length > 0 ? articleTags.join(", ") : "None";

    return [
      `Title: ${article.title}`,
      `Date: ${formattedDate}`,
      `Tags: ${tagsLine}`,
      "",
      "Content:",
      sanitizedContent,
    ]
      .filter((line) => line !== "")
      .join("\n");
  }, [
    article.content,
    article.summary,
    article.title,
    articleTags,
    formattedDate,
  ]);

  const showMonetizationSection = article.slug === "why-portfolio-not-convert";

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
        <div className="article-content__nav-row article-content__nav-row--top">
          <Link
            href="/articles"
            className="article-content__back-link article-content__back-link--top"
          >
            ← Back to Articles
          </Link>
          <CopyButton
            copyText={copyPayload}
            ariaLabel="Copy article content to clipboard"
          />
        </div>

        <h1 id="article-title" className="article-content__title">
          {article.title}
        </h1>

        <div className="article-content__meta">
          <time
            className="article-content__date"
            dateTime={article.published_at}
          >
            {formattedDate}
          </time>
          <span
            className="article-content__reading-time"
            aria-label="Reading time"
          >
            {article.reading_time}
          </span>
        </div>

        {articleTags.length > 0 && (
          <div className="article-content__tags" aria-label="Article tags">
            {articleTags.map((tag) => (
              <span key={tag} className="article-content__tag">
                {tag}
              </span>
            ))}
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
            alt={article.img_alt ?? `Featured image for ${article.title}`}
            className="article-content__image"
            width={800}
            height={400}
            priority
          />
        </m.figure>
      )}

      {articleUrl && (
        <m.div className="article-content__share" variants={itemVariants}>
          <SocialShareButtons url={articleUrl} title={article.title} />
        </m.div>
      )}

      <m.div className="article-content__body" variants={itemVariants}>
        {article.blocks?.length ? (
          renderArticleBlocks(article)
        ) : article.content ? (
          renderContent(article.content)
        ) : (
          <p className="article-content__summary">{article.summary}</p>
        )}
      </m.div>

      {showMonetizationSection ? (
        <m.section
          className="article-content__monetization"
          variants={itemVariants}
        >
          <StealPatternCTA articleSlug={article.slug} />
        </m.section>
      ) : null}

      <m.footer className="article-content__footer" variants={itemVariants}>
        <div className="article-content__nav-row">
          <Link href="/articles" className="article-content__back-link">
            ← Back to Articles
          </Link>
          <CopyButton
            copyText={copyPayload}
            ariaLabel="Copy article content to clipboard"
          />
        </div>
      </m.footer>
    </m.article>
  );
};

export default ArticleContent;
