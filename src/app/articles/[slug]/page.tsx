import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { StealPatternCTA } from "@/molecules/Monetization";
import model from "@/domains/article/model";
import accessModel from "@/domains/access/model";
import { auth } from "@/lib/auth";
import ArticleContent from "@/organisms/ArticleContent";
import { generateArticleJsonLd } from "@/lib/seo";
import { logger } from "@/lib/logger";

// Deduplicate fetch calls between generateMetadata and page component
const getArticle = cache((slug: string) => model.fetchBySlug(slug));
const openGraphAuthor =
  process.env.NEXT_PUBLIC_AUTHOR_NAME ?? "openGraphAuthor";

const monetizedArticleMap: Record<string, string> = {
  "why-portfolio-not-convert": "article-why-portfolio-pattern",
};

const getProductKeyForSlug = (slug: string): string | null => {
  return monetizedArticleMap[slug] ?? null;
};

const getSessionUserId = async (): Promise<string | null> => {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    return session?.user?.id ?? null;
  } catch (error) {
    logger.error("Payments", "Failed to resolve session for article access", {
      error,
    });
    return null;
  }
};

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

  const productKey = getProductKeyForSlug(slug);
  if (productKey) {
    const userId = await getSessionUserId();
    const unlocked = userId
      ? await accessModel.hasAccess(userId, productKey)
      : false;

    if (!unlocked) {
      return (
        <main className="mx-auto max-w-3xl px-4 py-16 text-dark dark:text-light">
          <header>
            <p className="text-sm uppercase tracking-[0.2em] opacity-80">
              Premium article
            </p>
            <h1 className="mt-3 text-4xl font-semibold">{article.title}</h1>
            <p className="mt-4 text-base opacity-90 dark:opacity-80">
              {article.summary}
            </p>
          </header>

          <section className="mt-8 rounded-xl border border-dark/15 p-6 dark:border-light/20">
            <h2 className="text-2xl font-semibold">This content is locked</h2>
            <p className="mt-3 text-base opacity-90 dark:opacity-80">
              Purchase access to unlock the full implementation details and
              reusable assets.
            </p>

            <div className="mt-6">
              <StealPatternCTA />
            </div>
          </section>
        </main>
      );
    }
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
