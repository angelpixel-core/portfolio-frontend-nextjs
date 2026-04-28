import type { Article } from "@/domains/article";

export interface ArticleJsonLd {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
}

/**
 * Generates JSON-LD structured data for an article
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function generateArticleJsonLd(
  article: Article,
  siteUrl: string
): ArticleJsonLd {
  // Ensure image URL is absolute
  const imageUrl = article.img.startsWith("http")
    ? article.img
    : `${siteUrl}${article.img}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: imageUrl,
    datePublished: article.published_at,
    author: {
      "@type": "Person",
      name: "Angel Szymczak",
    },
    publisher: {
      "@type": "Organization",
      name: "Portfolio",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}

/**
 * Renders JSON-LD as a script tag string for embedding in HTML
 */
export function renderJsonLdScript(jsonLd: ArticleJsonLd): string {
  return JSON.stringify(jsonLd);
}
