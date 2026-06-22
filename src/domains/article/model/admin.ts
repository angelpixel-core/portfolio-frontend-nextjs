import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
import {
  ArticleSchema,
  ArticlesSchema,
  type ArticleBlock,
  type ArticleBlocks,
  type Article,
  type Articles,
} from "./schema";

type ArticleRow = {
  article: typeof import("../../../db/schema").contentArticles.$inferSelect;
  assetUrl: string | null;
  assetId: string | null;
};

type ArticleBlockRow = {
  block: typeof import("../../../db/schema").contentArticleBlocks.$inferSelect;
  assetUrl: string | null;
};

const normalizeBlocks = (
  rows: ArticleBlockRow[]
): ArticleBlocks | undefined => {
  if (rows.length === 0) return undefined;

  return rows
    .map(({ block, assetUrl }) => ({
      id: block.id,
      article_id: block.articleId,
      sort_order: block.sortOrder,
      block_type: block.blockType,
      title: block.title ?? undefined,
      body: block.body ?? undefined,
      image_asset_id: block.imageAssetId ?? undefined,
      image_ref: block.imageRef ?? undefined,
      image_alt: block.imageAlt ?? undefined,
      image_position: block.imagePosition ?? undefined,
      caption: block.caption ?? undefined,
      ...(assetUrl ? { image_url: assetUrl } : {}),
    }))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((block) => {
      const normalized: ArticleBlock = {
        id: block.id,
        article_id: block.article_id,
        sort_order: block.sort_order,
        block_type: block.block_type,
      };

      if (block.title) normalized.title = block.title;
      if (block.body) normalized.body = block.body;
      if (block.image_asset_id)
        normalized.image_asset_id = block.image_asset_id;
      if (block.image_ref) normalized.image_ref = block.image_ref;
      if (block.image_alt) normalized.image_alt = block.image_alt;
      if (block.image_position)
        normalized.image_position = block.image_position;
      if (block.caption) normalized.caption = block.caption;
      if (block.image_url) normalized.image_url = block.image_url;

      return normalized;
    });
};

const normalizeArticle = (
  article: ArticleRow["article"],
  assetUrl: string | null,
  assetId: string | null,
  blocks: ArticleBlocks | undefined
): Article => ({
  id: article.id,
  title: article.title,
  url: article.url,
  slug: article.slug,
  lang: article.lang,
  reading_time: article.readingTime,
  published_at: article.publishedAt,
  summary: article.summary,
  content: article.content ?? undefined,
  img: assetUrl ?? article.img,
  img_alt: article.imgAlt ?? undefined,
  hero_asset_id: assetId ?? article.heroAssetId ?? undefined,
  blocks,
  featured: article.featured,
  visible: article.visible,
  priority: article.priority,
  category: article.category ?? undefined,
  badges: article.badges ?? undefined,
  status: article.status,
});

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const normalizeDraftArticle = (
  payload: Partial<Article>,
  id: number
): Article => {
  const slug = payload.slug?.trim() || `new-article-${id}`;
  const title = payload.title?.trim() || "Untitled article";

  return ArticleSchema.parse({
    id,
    title,
    url: payload.url?.trim() || `/articles/${slug}`,
    slug,
    lang: payload.lang ?? "ES",
    reading_time: payload.reading_time?.trim() || "0 min read",
    published_at: payload.published_at?.trim() || todayIso(),
    summary: payload.summary ?? "",
    content: payload.content,
    img: payload.img?.trim() || "",
    img_alt: payload.img_alt?.trim() || undefined,
    hero_asset_id: payload.hero_asset_id,
    blocks: payload.blocks,
    featured: payload.featured ?? false,
    visible: payload.visible ?? true,
    priority: payload.priority ?? 0,
    category: payload.category,
    badges: payload.badges,
    status: payload.status ?? "draft",
  });
};

const getNextArticleId = async (): Promise<number> => {
  if (isMemoryDriver()) {
    const items = memoryStore.getArticles();
    return items.reduce((maxId, article) => Math.max(maxId, article.id), 0) + 1;
  }

  const { db } = await import("../../../db");
  const { contentArticles } = await import("../../../db/schema");

  const rows = await db
    .select({ id: contentArticles.id })
    .from(contentArticles)
    .orderBy(desc(contentArticles.id))
    .limit(1);

  return (rows[0]?.id ?? 0) + 1;
};

const articleAdminModel = {
  async fetchAllForAdmin(): Promise<Articles> {
    if (isMemoryDriver()) {
      return ArticlesSchema.parse(memoryStore.getArticles());
    }

    const { db } = await import("../../../db");
    const { contentArticles, contentAssets, contentArticleBlocks } =
      await import("../../../db/schema");
    const rows = await db
      .select({
        article: contentArticles,
        assetUrl: contentAssets.url,
        assetId: contentAssets.id,
      })
      .from(contentArticles)
      .leftJoin(
        contentAssets,
        eq(contentArticles.heroAssetId, contentAssets.id)
      );

    const blocks = await db
      .select({
        block: contentArticleBlocks,
        assetUrl: contentAssets.url,
      })
      .from(contentArticleBlocks)
      .leftJoin(
        contentAssets,
        eq(contentArticleBlocks.imageAssetId, contentAssets.id)
      )
      .orderBy(asc(contentArticleBlocks.sortOrder));

    const blocksByArticle = new Map<number, ArticleBlockRow[]>();
    for (const row of blocks) {
      const list = blocksByArticle.get(row.block.articleId) ?? [];
      list.push(row);
      blocksByArticle.set(row.block.articleId, list);
    }

    const normalized = rows.map(({ article, assetUrl, assetId }) =>
      normalizeArticle(
        article,
        assetUrl,
        assetId,
        normalizeBlocks(blocksByArticle.get(article.id) ?? [])
      )
    );

    return ArticlesSchema.parse(normalized);
  },

  async fetchById(id: number): Promise<Article | null> {
    if (isMemoryDriver()) {
      return (
        ArticlesSchema.parse(memoryStore.getArticles()).find(
          (article) => article.id === id
        ) ?? null
      );
    }

    const { db } = await import("../../../db");
    const { contentArticles, contentAssets, contentArticleBlocks } =
      await import("../../../db/schema");

    const articleRows = await db
      .select({
        article: contentArticles,
        assetUrl: contentAssets.url,
        assetId: contentAssets.id,
      })
      .from(contentArticles)
      .leftJoin(
        contentAssets,
        eq(contentArticles.heroAssetId, contentAssets.id)
      )
      .where(eq(contentArticles.id, id))
      .limit(1);

    if (articleRows.length === 0) return null;

    const blockRows = await db
      .select({
        block: contentArticleBlocks,
        assetUrl: contentAssets.url,
      })
      .from(contentArticleBlocks)
      .leftJoin(
        contentAssets,
        eq(contentArticleBlocks.imageAssetId, contentAssets.id)
      )
      .where(eq(contentArticleBlocks.articleId, id))
      .orderBy(asc(contentArticleBlocks.sortOrder));

    const articleRow = articleRows[0];
    return normalizeArticle(
      articleRow.article,
      articleRow.assetUrl,
      articleRow.assetId,
      normalizeBlocks(blockRows)
    );
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
    const { contentArticles, contentArticleBlocks } =
      await import("../../../db/schema");

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

    if (normalized.blocks) {
      await db
        .delete(contentArticleBlocks)
        .where(eq(contentArticleBlocks.articleId, id));

      if (normalized.blocks.length > 0) {
        await db.insert(contentArticleBlocks).values(
          normalized.blocks.map((block) => ({
            id: block.id,
            articleId: id,
            sortOrder: block.sort_order,
            blockType: block.block_type,
            title: block.title ?? null,
            body: block.body ?? null,
            imageAssetId: block.image_asset_id ?? null,
            imageRef: block.image_ref ?? null,
            imageAlt: block.image_alt ?? null,
            imagePosition: block.image_position ?? null,
            caption: block.caption ?? null,
          }))
        );
      }
    }

    return normalized;
  },

  async createDraft(payload: Partial<Article>): Promise<Article> {
    const id = await getNextArticleId();
    const normalized = normalizeDraftArticle(payload, id);

    if (isMemoryDriver()) {
      const items = memoryStore.getArticles();
      memoryStore.setArticles([...items, normalized]);
      return normalized;
    }

    const { db } = await import("../../../db");
    const { contentArticles, contentArticleBlocks } =
      await import("../../../db/schema");

    await db.insert(contentArticles).values({
      id: normalized.id,
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
      heroAssetId: normalized.hero_asset_id ?? null,
      featured: normalized.featured,
      visible: normalized.visible ?? true,
      priority: normalized.priority ?? 0,
      category: normalized.category ?? null,
      badges: normalized.badges ?? null,
      status: normalized.status ?? "draft",
    });

    if (normalized.blocks && normalized.blocks.length > 0) {
      await db.insert(contentArticleBlocks).values(
        normalized.blocks.map((block) => ({
          id: block.id,
          articleId: normalized.id,
          sortOrder: block.sort_order,
          blockType: block.block_type,
          title: block.title ?? null,
          body: block.body ?? null,
          imageAssetId: block.image_asset_id ?? null,
          imageRef: block.image_ref ?? null,
          imageAlt: block.image_alt ?? null,
          imagePosition: block.image_position ?? null,
          caption: block.caption ?? null,
        }))
      );
    }

    return normalized;
  },
};

export default articleAdminModel;
