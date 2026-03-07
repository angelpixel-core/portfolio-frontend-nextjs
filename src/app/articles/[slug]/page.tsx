import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import model from "@/domains/article/model";
import ArticleContent from "@/organisms/ArticleContent";
import { generateArticleJsonLd } from "@/lib/seo";

// Deduplicate fetch calls between generateMetadata and page component
const getArticle = cache((slug: string) => model.fetchBySlug(slug));
const openGraphAuthor =
  process.env.NEXT_PUBLIC_AUTHOR_NAME ?? "openGraphAuthor";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | Articles",
    };
  }

  return {
    title: `${article.title} | Articles`,
    description: article.summary,
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.img],
      type: "article",
      publishedTime: article.published_at,
      authors: [openGraphAuthor],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.img],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: Props): Promise<React.JSX.Element> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const jsonLd = generateArticleJsonLd(article, siteUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleContent article={article} />
    </>
  );
}
