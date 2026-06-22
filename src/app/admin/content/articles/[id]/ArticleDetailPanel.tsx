"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";

import type {
  Article,
  ArticleBlock,
} from "@/domains/article/model/schema";

type SaveState = "idle" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "uploaded" | "error";
type EditableArticle = Article & { saveState: SaveState };

const createEmptyBlock = (
  articleId: number,
  sortOrder: number,
  blockType: ArticleBlock["block_type"] = "text"
): ArticleBlock => ({
  id: crypto.randomUUID(),
  article_id: articleId,
  sort_order: sortOrder,
  block_type: blockType,
});

const sortBlocks = (blocks: ArticleBlock[]): ArticleBlock[] =>
  [...blocks].sort((a, b) => a.sort_order - b.sort_order);

const renumberBlocks = (blocks: ArticleBlock[]): ArticleBlock[] =>
  sortBlocks(blocks).map((block, index) => ({
    ...block,
    sort_order: index,
  }));

interface Props {
  article: Article;
}

export default function ArticleDetailPanel({ article }: Props): JSX.Element {
  const [item, setItem] = useState<EditableArticle>({
    ...article,
    blocks: article.blocks ?? [],
    saveState: "idle",
  });
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const sortedBlocks = useMemo(
    () => renumberBlocks(item.blocks ?? []),
    [item.blocks]
  );

  const updateField = <K extends keyof EditableArticle>(
    key: K,
    value: EditableArticle[K]
  ) => {
    setItem((prev) => ({ ...prev, [key]: value, saveState: "idle" }));
  };

  const updateBlock = <K extends keyof ArticleBlock>(
    id: string,
    key: K,
    value: ArticleBlock[K]
  ) => {
    setItem((prev) => ({
      ...prev,
      blocks: (prev.blocks ?? []).map((block) =>
        block.id === id ? { ...block, [key]: value } : block
      ),
      saveState: "idle",
    }));
  };

  const addBlock = (blockType: ArticleBlock["block_type"] = "text") => {
    setItem((prev) => {
      const nextBlocks = prev.blocks ?? [];
      return {
        ...prev,
        blocks: [
          ...nextBlocks,
          createEmptyBlock(prev.id, nextBlocks.length, blockType),
        ],
        saveState: "idle",
      };
    });
  };

  const removeBlock = (id: string) => {
    setItem((prev) => ({
      ...prev,
      blocks: (prev.blocks ?? []).filter((block) => block.id !== id),
      saveState: "idle",
    }));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    setItem((prev) => {
      const blocks = renumberBlocks(prev.blocks ?? []);
      const index = blocks.findIndex((block) => block.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= blocks.length) return prev;

      const next = [...blocks];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);

      return {
        ...prev,
        blocks: renumberBlocks(next),
        saveState: "idle",
      };
    });
  };

  const uploadHeroImage = async (file: File | null) => {
    if (!file) return;

    setUploadState("uploading");
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.set("articleId", String(item.id));
      formData.set("file", file);

      const response = await fetch("/api/admin/content/articles/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        ok: boolean;
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.url) {
        throw new Error(data.error ?? "upload_failed");
      }

      updateField("img", data.url);
      setUploadState("uploaded");
      window.setTimeout(() => setUploadState("idle"), 1200);
    } catch (error) {
      setUploadState("error");
      setUploadError(
        error instanceof Error ? error.message : "upload_failed"
      );
    }
  };

  const uploadBlockImage = async (blockId: string, file: File | null) => {
    if (!file) return;

    setUploadState("uploading");
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.set("blockId", blockId);
      formData.set("file", file);

      const response = await fetch(
        `/api/admin/content/articles/${item.id}/blocks/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = (await response.json()) as {
        ok: boolean;
        url?: string;
        assetId?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.url || !data.assetId) {
        throw new Error(data.error ?? "upload_failed");
      }

      updateBlock(blockId, "image_asset_id", data.assetId);
      updateBlock(blockId, "image_url", data.url);
      setUploadState("uploaded");
      window.setTimeout(() => setUploadState("idle"), 1200);
    } catch (error) {
      setUploadState("error");
      setUploadError(
        error instanceof Error ? error.message : "upload_failed"
      );
    }
  };

  const saveArticle = async () => {
    updateField("saveState", "saving");

    try {
      const payload = {
        ...item,
        blocks: renumberBlocks(item.blocks ?? []),
      };

      const response = await fetch(`/api/admin/content/articles/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; item?: Article };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not save article");
      }

      setItem({
        ...data.item,
        blocks: data.item.blocks ?? [],
        saveState: "saved",
      });
      window.setTimeout(() => updateField("saveState", "idle"), 1200);
    } catch {
      updateField("saveState", "error");
    }
  };

  return (
    <div className="space-y-6">
      <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <div className="grid gap-3 tablet:grid-cols-2">
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
            value={item.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Title"
          />
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
            value={item.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="Slug"
          />
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
            value={item.url}
            onChange={(event) => updateField("url", event.target.value)}
            placeholder="URL"
          />
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
            value={item.reading_time}
            onChange={(event) =>
              updateField("reading_time", event.target.value)
            }
            placeholder="Reading time"
          />
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
            value={item.published_at}
            onChange={(event) =>
              updateField("published_at", event.target.value)
            }
            placeholder="Published at (YYYY-MM-DD)"
          />
          <select
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
            value={item.status ?? "published"}
            onChange={(event) =>
              updateField("status", event.target.value as Article["status"])
            }
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
          <textarea
            className="min-h-[96px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
            value={item.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            placeholder="Summary"
          />
          <textarea
            className="min-h-[160px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
            value={item.content ?? ""}
            onChange={(event) => updateField("content", event.target.value)}
            placeholder="Legacy content fallback"
          />
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
            value={item.img}
            onChange={(event) => updateField("img", event.target.value)}
            placeholder="Hero / card image URL"
          />
          <input
            className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
            value={item.img_alt ?? ""}
            onChange={(event) =>
              updateField("img_alt", event.target.value || undefined)
            }
            placeholder="Hero image alt text"
          />
          <div className="rounded border border-dark/20 px-3 py-2 text-sm tablet:col-span-2">
            <label className="mb-2 block text-xs opacity-80" htmlFor={`hero-upload-${item.id}`}>
              Upload hero image to blob storage
            </label>
            <input
              id={`hero-upload-${item.id}`}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                void uploadHeroImage(file);
                event.currentTarget.value = "";
              }}
            />
            <p className="mt-2 text-xs opacity-70">
              {uploadState === "uploading" && "Uploading..."}
              {uploadState === "uploaded" && "Uploaded and URL assigned"}
              {uploadState === "error" && `Upload failed: ${uploadError ?? "unknown"}`}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm tablet:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(item.visible ?? true)}
                onChange={(event) => updateField("visible", event.target.checked)}
              />
              Visible
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(event) => updateField("featured", event.target.checked)}
              />
              Featured
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="rounded bg-dark px-3 py-2 text-sm text-light dark:bg-light dark:text-dark"
            onClick={saveArticle}
          >
            Save article
          </button>
          <span className="text-xs opacity-80">
            {item.saveState === "saving" && "Saving..."}
            {item.saveState === "saved" && "Saved"}
            {item.saveState === "error" && "Save failed"}
          </span>
        </div>
      </article>

      <section className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">Content blocks</h3>
            <p className="text-sm opacity-80">
              Ordered blocks that will eventually power the public article renderer.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-dark/20 px-3 py-2 text-sm"
              onClick={() => addBlock("text")}
            >
              Add text block
            </button>
            <button
              type="button"
              className="rounded border border-dark/20 px-3 py-2 text-sm"
              onClick={() => addBlock("image")}
            >
              Add image block
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {sortedBlocks.length === 0 ? (
            <p className="text-sm opacity-80">No blocks yet.</p>
          ) : null}

          {sortedBlocks.map((block, index) => (
            <article key={block.id} className="rounded border border-dark/20 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="font-semibold">
                  Block #{index + 1} <span className="opacity-70">({block.block_type})</span>
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded border border-dark/20 px-2 py-1 text-xs"
                    onClick={() => moveBlock(block.id, "up")}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="rounded border border-dark/20 px-2 py-1 text-xs"
                    onClick={() => moveBlock(block.id, "down")}
                    disabled={index === sortedBlocks.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="rounded border border-dark/20 px-2 py-1 text-xs"
                    onClick={() => removeBlock(block.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-3 tablet:grid-cols-2">
                <select
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={block.block_type}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "block_type",
                      event.target.value as ArticleBlock["block_type"]
                    )
                  }
                >
                  <option value="text">text</option>
                  <option value="image">image</option>
                  <option value="quote">quote</option>
                  <option value="callout">callout</option>
                  <option value="code">code</option>
                  <option value="divider">divider</option>
                </select>
                <input
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={block.title ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, "title", event.target.value || undefined)
                  }
                  placeholder="Block title"
                />
                <textarea
                  className="min-h-[96px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
                  value={block.body ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, "body", event.target.value || undefined)
                  }
                  placeholder="Block body"
                />
                <input
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={block.image_asset_id ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "image_asset_id",
                      event.target.value || undefined
                    )
                  }
                  placeholder="Image asset id"
                />
                <div className="rounded border border-dark/20 px-3 py-2 text-sm tablet:col-span-2">
                  {block.image_url ? (
                    <img
                      src={block.image_url}
                      alt={block.image_alt ?? block.title ?? block.id}
                      className="mb-3 max-h-48 w-full rounded object-cover"
                    />
                  ) : (
                    <p className="mb-3 text-xs opacity-70">No block image uploaded yet.</p>
                  )}
                  <label className="mb-2 block text-xs opacity-80" htmlFor={`block-upload-${block.id}`}>
                    Upload block image
                  </label>
                  <input
                    id={`block-upload-${block.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] ?? null;
                      void uploadBlockImage(block.id, file);
                      event.currentTarget.value = "";
                    }}
                  />
                </div>
                <input
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={block.image_ref ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, "image_ref", event.target.value || undefined)
                  }
                  placeholder="Image ref"
                />
                <input
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={block.image_alt ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, "image_alt", event.target.value || undefined)
                  }
                  placeholder="Image alt"
                />
                <select
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={block.image_position ?? "top"}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "image_position",
                      event.target.value as ArticleBlock["image_position"]
                    )
                  }
                >
                  <option value="top">top</option>
                  <option value="left">left</option>
                  <option value="right">right</option>
                  <option value="bottom">bottom</option>
                </select>
                <input
                  className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
                  value={block.caption ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, "caption", event.target.value || undefined)
                  }
                  placeholder="Caption"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
