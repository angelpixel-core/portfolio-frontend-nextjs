import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
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

const isCheckoutMonetizationMode = (): boolean => {
  return process.env.NEXT_PUBLIC_MONETIZATION_MODE === "checkout";
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
  let showLockedNotice = false;

  if (productKey && isCheckoutMonetizationMode()) {
    const userId = await getSessionUserId();
    const unlocked = userId
      ? await accessModel.hasAccess(userId, productKey)
      : false;

    if (!unlocked) {
      showLockedNotice = true;
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
      {showLockedNotice ? (
        <section className="mx-auto mt-8 max-w-3xl rounded-xl border border-dark/15 px-4 py-6 text-dark dark:border-light/20 dark:text-light">
          <h2 className="text-2xl font-semibold">This content is locked</h2>
          <p className="mt-3 text-base opacity-90 dark:opacity-80">
            The full downloadable asset link is currently hidden.
          </p>
          <a
            href="#"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            data-testid="locked-placeholder-link"
          >
            Placeholder premium link
          </a>
        </section>
      ) : null}
    </>
  );
}
