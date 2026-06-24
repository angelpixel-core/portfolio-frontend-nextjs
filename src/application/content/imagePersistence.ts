import { and, eq } from "drizzle-orm";

import { isMemoryDriver } from "../../db/runtime";
import { memoryStore } from "../../db/memory-store";

type PersistArticleImageInput = {
  articleId: number;
  fileType: string;
  fileSize: number;
  uploadedUrl: string;
  uploadedKey: string;
};

type PersistProjectImageInput = {
  projectId: number;
  fileType: string;
  fileSize: number;
  uploadedUrl: string;
  uploadedKey: string;
};

type PersistArticleBlockImageInput = {
  articleId: number;
  blockId: string;
  fileType: string;
  fileSize: number;
  uploadedUrl: string;
  uploadedKey: string;
};

export const persistArticleImage = async ({
  articleId,
  fileType,
  fileSize,
  uploadedUrl,
  uploadedKey,
}: PersistArticleImageInput): Promise<void> => {
  if (isMemoryDriver()) {
    const articles = memoryStore.getArticles();
    const idx = articles.findIndex((article) => article.id === articleId);
    if (idx !== -1) {
      articles[idx] = {
        ...articles[idx],
        img: uploadedUrl,
      };
      memoryStore.setArticles(articles);
    }
    return;
  }

  const { db } = await import("../../db");
  const { contentAssets, contentArticles } = await import("../../db/schema");

  const provider = "vercel-blob";
  const existingAsset = await db
    .select({ id: contentAssets.id })
    .from(contentAssets)
    .where(eq(contentAssets.providerKey, uploadedKey))
    .limit(1);

  const assetId =
    existingAsset[0]?.id ??
    `asset_${articleId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (!existingAsset[0]) {
    await db.insert(contentAssets).values({
      id: assetId,
      url: uploadedUrl,
      provider,
      providerKey: uploadedKey,
      mimeType: fileType,
      sizeBytes: fileSize,
      alt: null,
    });
  } else {
    await db
      .update(contentAssets)
      .set({
        url: uploadedUrl,
        mimeType: fileType,
        sizeBytes: fileSize,
        updatedAt: new Date(),
      })
      .where(eq(contentAssets.id, assetId));
  }

  await db
    .update(contentArticles)
    .set({
      img: uploadedUrl,
      heroAssetId: assetId,
      updatedAt: new Date(),
    })
    .where(eq(contentArticles.id, articleId));
};

export const persistProjectImage = async ({
  projectId,
  fileType,
  fileSize,
  uploadedUrl,
  uploadedKey,
}: PersistProjectImageInput): Promise<void> => {
  if (isMemoryDriver()) {
    const projects = memoryStore.getProjects();
    const idx = projects.findIndex((project) => project.id === projectId);
    if (idx !== -1) {
      projects[idx] = {
        ...projects[idx],
        img: uploadedUrl,
      };
      memoryStore.setProjects(projects);
    }
    return;
  }

  const { db } = await import("../../db");
  const { contentAssets, contentProjects } = await import("../../db/schema");

  const provider = "vercel-blob";
  const existingAsset = await db
    .select({ id: contentAssets.id })
    .from(contentAssets)
    .where(eq(contentAssets.providerKey, uploadedKey))
    .limit(1);

  const assetId =
    existingAsset[0]?.id ??
    `asset_project_${projectId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (!existingAsset[0]) {
    await db.insert(contentAssets).values({
      id: assetId,
      url: uploadedUrl,
      provider,
      providerKey: uploadedKey,
      mimeType: fileType,
      sizeBytes: fileSize,
      alt: null,
    });
  } else {
    await db
      .update(contentAssets)
      .set({
        url: uploadedUrl,
        mimeType: fileType,
        sizeBytes: fileSize,
        updatedAt: new Date(),
      })
      .where(eq(contentAssets.id, assetId));
  }

  await db
    .update(contentProjects)
    .set({
      img: uploadedUrl,
      heroAssetId: assetId,
      updatedAt: new Date(),
    })
    .where(eq(contentProjects.id, projectId));
};

export const persistArticleBlockImage = async ({
  articleId,
  blockId,
  fileType,
  fileSize,
  uploadedUrl,
  uploadedKey,
}: PersistArticleBlockImageInput): Promise<{ assetId: string }> => {
  const assetId = `asset_block_${articleId}_${blockId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (isMemoryDriver()) {
    const articles = memoryStore.getArticles();
    const articleIdx = articles.findIndex(
      (article) => article.id === articleId
    );
    if (articleIdx !== -1) {
      const article = articles[articleIdx];
      articles[articleIdx] = {
        ...article,
        blocks: (article.blocks ?? []).map((block) =>
          block.id === blockId
            ? { ...block, image_asset_id: assetId, image_url: uploadedUrl }
            : block
        ),
      };
      memoryStore.setArticles(articles);
    }
    return { assetId };
  }

  const { db } = await import("../../db");
  const { contentAssets, contentArticleBlocks } =
    await import("../../db/schema");

  const provider = "vercel-blob";
  const existingAsset = await db
    .select({ id: contentAssets.id })
    .from(contentAssets)
    .where(eq(contentAssets.providerKey, uploadedKey))
    .limit(1);

  const existingAssetId = existingAsset[0]?.id ?? assetId;

  if (!existingAsset[0]) {
    await db.insert(contentAssets).values({
      id: existingAssetId,
      url: uploadedUrl,
      provider,
      providerKey: uploadedKey,
      mimeType: fileType,
      sizeBytes: fileSize,
      alt: null,
    });
  } else {
    await db
      .update(contentAssets)
      .set({
        url: uploadedUrl,
        mimeType: fileType,
        sizeBytes: fileSize,
        updatedAt: new Date(),
      })
      .where(eq(contentAssets.id, existingAssetId));
  }

  await db
    .update(contentArticleBlocks)
    .set({
      imageAssetId: existingAssetId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(contentArticleBlocks.id, blockId),
        eq(contentArticleBlocks.articleId, articleId)
      )
    );

  return { assetId: existingAssetId };
};
