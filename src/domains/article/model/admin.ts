import "server-only";

import { eq } from "drizzle-orm";

import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
import {
  ArticleSchema,
  ArticlesSchema,
  type Article,
  type Articles,
} from "./schema";

const articleAdminModel = {
  async fetchAllForAdmin(): Promise<Articles> {
    if (isMemoryDriver()) {
      return ArticlesSchema.parse(memoryStore.getArticles());
    }

    const { db } = await import("../../../db");
    const { contentArticles } = await import("../../../db/schema");
    const rows = await db.select().from(contentArticles);

    const normalized = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      slug: row.slug,
      lang: row.lang,
      reading_time: row.readingTime,
      published_at: row.publishedAt,
      summary: row.summary,
      content: row.content ?? undefined,
      img: row.img,
      img_alt: row.imgAlt ?? undefined,
      featured: row.featured,
      visible: row.visible,
      priority: row.priority,
      category: row.category ?? undefined,
      badges: row.badges ?? undefined,
      status: row.status,
    }));

    return ArticlesSchema.parse(normalized);
  },

  async updateById(id: number, payload: Article): Promise<Article> {
    if (isMemoryDriver()) {
      const items = memoryStore.getArticles();
      const idx = items.findIndex((item) => item.id === id);

      if (idx === -1) {
        throw new Error(`Article ${id} not found`);
      }

      const normalized = ArticleSchema.parse({ ...payload, id });
      items[idx] = normalized;
      memoryStore.setArticles(items);
      return normalized;
    }

    const normalized = ArticleSchema.parse({ ...payload, id });

    const { db } = await import("../../../db");
    const { contentArticles } = await import("../../../db/schema");

    const existing = await db
      .select({ id: contentArticles.id })
      .from(contentArticles)
      .where(eq(contentArticles.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new Error(`Article ${id} not found`);
    }

    await db
      .update(contentArticles)
      .set({
        title: normalized.title,
        url: normalized.url,
        slug: normalized.slug,
        lang: normalized.lang,
        readingTime: normalized.reading_time,
        publishedAt: normalized.published_at,
        summary: normalized.summary,
        content: normalized.content ?? null,
        img: normalized.img,
        imgAlt: normalized.img_alt ?? null,
        featured: normalized.featured,
        visible: normalized.visible ?? true,
        priority: normalized.priority ?? 0,
        category: normalized.category ?? null,
        badges: normalized.badges ?? null,
        status: normalized.status ?? "published",
        updatedAt: new Date(),
      })
      .where(eq(contentArticles.id, id));

    return normalized;
  },
};

export default articleAdminModel;
