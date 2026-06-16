import "server-only";

import articleAdminModel from "@/domains/article/model/admin";
import type { Article, Articles } from "@/domains/article/model/schema";

const sortByPublishedDate = (articles: Articles): Articles => {
  return [...articles].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
};

const isArticlePublished = (article: Article): boolean => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (article.status === "draft") {
    return false;
  }

  if (article.visible === false) {
    return false;
  }

  return new Date(article.published_at).getTime() <= now.getTime();
};

export const getPublishedArticles = async (): Promise<Articles> => {
  const articles = await articleAdminModel.fetchAllForAdmin();
  const published = articles.filter(isArticlePublished);
  return sortByPublishedDate(published);
};

export const getPublishedArticleById = async (
  id: number
): Promise<Article | null> => {
  const articles = await getPublishedArticles();
  return articles.find((article) => article.id === id) ?? null;
};

export const getPublishedArticleBySlug = async (
  slug: string
): Promise<Article | null> => {
  const articles = await getPublishedArticles();
  return articles.find((article) => article.slug === slug) ?? null;
};
