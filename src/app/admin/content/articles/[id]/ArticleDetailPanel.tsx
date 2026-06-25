"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, ReactNode } from "react";
import Image from "next/image";

import type { Article, ArticleBlock } from "@/domains/article/model/schema";
import ArticleContent from "@/organisms/ArticleContent";

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

type FieldProps = {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

type BlockCardProps = {
  preview: ReactNode;
  children: ReactNode;
};

const articleUrlFromSlug = (slug: string): string => `/articles/${slug.trim()}`;

const Field = ({ label, hint, className = "", children }: FieldProps) => (
  <label className={`space-y-1 text-sm ${className}`}>
    <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
      {label}
    </span>
    {children}
    {hint ? <span className="block text-xs opacity-60">{hint}</span> : null}
  </label>
);

const BlockCard = ({ preview, children }: BlockCardProps) => (
  <article className="overflow-hidden rounded-2xl border border-dark/15 bg-dark/5 p-4 shadow-sm dark:border-light/15 dark:bg-light/5">
    <div className="mb-4 rounded-xl border border-dark/10 bg-white/80 p-4 text-sm shadow-sm dark:bg-dark/20">
      {preview}
    </div>

    {children}
  </article>
);

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
  const todayIso = () => new Date().toISOString().split("T")[0];

  const sortedBlocks = useMemo(
    () => renumberBlocks(item.blocks ?? []),
    [item.blocks]
  );

  useEffect(() => {
    const targetId = `hero-upload-${item.id}`;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash !== targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const timeout = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      const fileInput =
        target.querySelector<HTMLInputElement>('input[type="file"]');
      fileInput?.focus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [item.id]);

  const updateField = <K extends keyof EditableArticle>(
    key: K,
    value: EditableArticle[K]
  ) => {
    setItem((prev) => {
      if (key === "slug" && typeof value === "string") {
        return {
          ...prev,
          slug: value,
          url: articleUrlFromSlug(value),
          saveState: "idle",
        };
      }

      return { ...prev, [key]: value, saveState: "idle" };
    });
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
      setUploadError(error instanceof Error ? error.message : "upload_failed");
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
      setUploadError(error instanceof Error ? error.message : "upload_failed");
    }
  };

  const reuseHeroImageInBlock = (blockId: string) => {
    if (!item.hero_asset_id && !item.img) return;

    setItem((prev) => ({
      ...prev,
      blocks: (prev.blocks ?? []).map((block) =>
        block.id === blockId
          ? {
              ...block,
              image_asset_id: prev.hero_asset_id ?? undefined,
              image_url: prev.img,
              image_alt: prev.img_alt ?? prev.title,
            }
          : block
      ),
      saveState: "idle",
    }));
  };

  const saveArticle = async () => {
    updateField("saveState", "saving");

    try {
      const payload = {
        ...item,
        url: articleUrlFromSlug(item.slug),
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

  const publishArticle = async () => {
    updateField("saveState", "saving");

    try {
      const payload = {
        ...item,
        status: "published" as const,
        visible: true,
        published_at: item.published_at?.trim() || todayIso(),
        url: articleUrlFromSlug(item.slug),
        blocks: renumberBlocks(item.blocks ?? []),
      };

      const response = await fetch(`/api/admin/content/articles/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; item?: Article };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not publish article");
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

  const summarize = (value?: string | null, words = 18) =>
    value?.trim().split(/\s+/).slice(0, words).join(" ") ?? "";

  const getBlockPreview = (block: ArticleBlock): ReactNode => {
    const textPreview = summarize(block.body, 18);
    const heading = block.title ?? block.caption ?? "Untitled block";

    if (block.block_type === "image") {
      return block.image_url ? (
        <div className="flex items-center gap-3">
          <Image
            src={block.image_url}
            alt={block.image_alt ?? block.title ?? block.id}
            width={160}
            height={90}
            unoptimized
            className="h-16 w-24 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="font-medium">Image block</p>
            <p className="truncate text-xs opacity-70">
              {block.caption ?? block.image_alt ?? block.title ?? "No caption"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">Image block</span>
          <span className="text-xs opacity-70">No image uploaded yet</span>
        </div>
      );
    }

    if (block.block_type === "quote") {
      return (
        <figure className="space-y-2 rounded border border-dark/20 bg-dark/5 p-3 dark:bg-light/5">
          <blockquote className="text-sm italic leading-relaxed">
            {textPreview || "Quote preview will appear here."}
          </blockquote>
          <figcaption className="text-xs opacity-70">{heading}</figcaption>
        </figure>
      );
    }

    if (block.block_type === "callout") {
      return (
        <div className="rounded border border-amber-400/40 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
            {heading}
          </p>
          <p className="leading-relaxed">
            {textPreview || "Callout preview will appear here."}
          </p>
        </div>
      );
    }

    if (block.block_type === "code") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs opacity-70">
            <span className="font-medium uppercase tracking-wide">Code</span>
            <span className="truncate">{heading}</span>
          </div>
          <pre className="overflow-hidden rounded bg-dark/90 p-3 text-xs leading-relaxed text-light dark:bg-light/90 dark:text-dark">
            <code>{textPreview || "// Code preview will appear here."}</code>
          </pre>
        </div>
      );
    }

    if (block.block_type === "text" || block.block_type === "divider") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs opacity-70">
            <span className="font-medium uppercase tracking-wide">
              {block.block_type}
            </span>
            <span className="truncate">{heading}</span>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed opacity-90">
            {textPreview || "Text preview will appear here."}
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium capitalize">{block.block_type} block</p>
          <p className="line-clamp-2 text-xs opacity-70">
            {textPreview || "No preview text available"}
          </p>
        </div>
        {block.block_type === "code" ? (
          <span className="rounded bg-dark/10 px-2 py-1 text-[11px] uppercase tracking-wide dark:bg-light/10">
            code
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <div className="grid gap-3 tablet:grid-cols-2">
          <Field
            label="Title"
            hint="Shown in the admin list and article header."
          >
            <input
              className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Title"
            />
          </Field>
          <Field label="Slug" hint="Used in the public article URL.">
            <input
              className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="Slug"
            />
          </Field>
          <Field label="URL" hint="Public path derived from the slug.">
            <div className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm">
              {articleUrlFromSlug(item.slug)}
            </div>
          </Field>
          <Field
            label="Reading time"
            hint="Minutes only. The UI adds the min read label."
          >
            <input
              type="number"
              min={0}
              step={1}
              className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.reading_time}
              onChange={(event) =>
                updateField(
                  "reading_time",
                  event.currentTarget.valueAsNumber || 0
                )
              }
              placeholder="Minutes"
            />
          </Field>
          <Field
            label="Published date"
            hint="Use YYYY-MM-DD for deterministic sorting."
          >
            <input
              type="date"
              className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.published_at}
              onChange={(event) =>
                updateField("published_at", event.target.value)
              }
              placeholder="Published at (YYYY-MM-DD)"
            />
          </Field>
          <Field
            label="Status"
            hint="Draft articles stay hidden from the public site."
          >
            <select
              className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.status ?? "published"}
              onChange={(event) =>
                updateField("status", event.target.value as Article["status"])
              }
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
          </Field>
          <Field
            label="Summary"
            hint="Keep this short for article cards and search previews."
            className="tablet:col-span-2"
          >
            <textarea
              className="min-h-[96px] w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              placeholder="Summary"
            />
          </Field>
          <Field
            label="Legacy content"
            hint="Fallback body used while the block editor remains incomplete."
            className="tablet:col-span-2"
          >
            <textarea
              className="min-h-[160px] w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.content ?? ""}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="Legacy content fallback"
            />
          </Field>
          <div className="rounded border border-dark/20 px-3 py-2 text-sm tablet:col-span-2">
            <label
              className="mb-2 block text-xs font-medium uppercase tracking-wide opacity-80"
              htmlFor={`hero-upload-${item.id}`}
            >
              Hero image
            </label>
            <p className="mb-2 text-xs opacity-60">
              Attach an image file. The server stores it and writes the public
              URL into the hero field.
            </p>
            {item.img ? (
              <Image
                src={item.img}
                alt={item.img_alt ?? item.title}
                width={1200}
                height={675}
                unoptimized
                className="mb-3 h-48 w-full rounded object-cover"
              />
            ) : (
              <p className="mb-3 text-xs opacity-70">
                No hero image uploaded yet.
              </p>
            )}
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
              {uploadState === "error" &&
                `Upload failed: ${uploadError ?? "unknown"}`}
            </p>
          </div>
          <Field
            label="Hero alt text"
            hint="Describe the image for accessibility."
            className="tablet:col-span-2"
          >
            <input
              className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.img_alt ?? ""}
              onChange={(event) =>
                updateField("img_alt", event.target.value || undefined)
              }
              placeholder="Hero image alt text"
            />
          </Field>
          <div className="flex items-center gap-4 text-sm tablet:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(item.visible ?? true)}
                onChange={(event) =>
                  updateField("visible", event.target.checked)
                }
              />
              Visible
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
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
          <button
            type="button"
            className="rounded border border-dark/20 px-3 py-2 text-sm"
            onClick={publishArticle}
          >
            Publish
          </button>
          <span className="text-xs opacity-80">
            {item.saveState === "saving" && "Saving..."}
            {item.saveState === "saved" && "Saved"}
            {item.saveState === "error" && "Save failed"}
          </span>
        </div>
      </article>

      <section className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Live preview</h3>
          <p className="text-sm opacity-80">
            This is the public article rendering using the current editor state.
          </p>
        </div>
        <ArticleContent article={item} />
      </section>

      <section className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">Content blocks</h3>
            <p className="text-sm opacity-80">
              Ordered blocks that will eventually power the public article
              renderer.
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
            <BlockCard key={block.id} preview={getBlockPreview(block)}>
              <div className="mb-4 flex flex-col gap-3 border-b border-dark/10 pb-3 sm:flex-row sm:items-start sm:justify-between">
                <h4 className="font-semibold leading-tight">
                  Block #{index + 1}{" "}
                  <span className="opacity-70">({block.block_type})</span>
                </h4>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <button
                    type="button"
                    className="rounded-full border border-dark/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-light/10"
                    onClick={() => moveBlock(block.id, "up")}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-dark/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-light/10"
                    onClick={() => moveBlock(block.id, "down")}
                    disabled={index === sortedBlocks.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-dark/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-light/10"
                    onClick={() => removeBlock(block.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 dark:bg-dark/10 dark:focus:border-light/40"
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
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 dark:bg-dark/10 dark:focus:border-light/40"
                  value={block.title ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "title",
                      event.target.value || undefined
                    )
                  }
                  placeholder="Block title"
                />
                <textarea
                  className="min-h-[112px] rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 md:col-span-2 dark:bg-dark/10 dark:focus:border-light/40"
                  value={block.body ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "body",
                      event.target.value || undefined
                    )
                  }
                  placeholder="Block body"
                />
                <input
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 dark:bg-dark/10 dark:focus:border-light/40"
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
                <div className="rounded-xl border border-dark/15 bg-white/70 px-3 py-3 text-sm shadow-sm md:col-span-2 dark:bg-dark/10">
                  {block.block_type === "image" ? (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-dark/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-light/10"
                        onClick={() => reuseHeroImageInBlock(block.id)}
                        disabled={!item.hero_asset_id}
                        title={
                          item.hero_asset_id
                            ? "Reuses the article hero asset in this block"
                            : "Upload the hero image first so it can be reused here"
                        }
                      >
                        Use hero image
                      </button>
                      <span className="text-xs opacity-70">
                        {item.hero_asset_id
                          ? "Copies the hero asset into this image block."
                          : "Hero reuse becomes available once the hero has an asset id."}
                      </span>
                    </div>
                  ) : null}
                  {block.image_url ? (
                    <Image
                      src={block.image_url}
                      alt={block.image_alt ?? block.title ?? block.id}
                      width={1200}
                      height={675}
                      unoptimized
                      className="mb-3 h-48 w-full rounded object-cover"
                    />
                  ) : (
                    <p className="mb-3 text-xs opacity-70">
                      No block image uploaded yet.
                    </p>
                  )}
                  <label
                    className="mb-2 block text-xs opacity-80"
                    htmlFor={`block-upload-${block.id}`}
                  >
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
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 dark:bg-dark/10 dark:focus:border-light/40"
                  value={block.image_ref ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "image_ref",
                      event.target.value || undefined
                    )
                  }
                  placeholder="Image ref"
                />
                <input
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 dark:bg-dark/10 dark:focus:border-light/40"
                  value={block.image_alt ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "image_alt",
                      event.target.value || undefined
                    )
                  }
                  placeholder="Image alt"
                />
                <select
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 dark:bg-dark/10 dark:focus:border-light/40"
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
                  className="rounded-xl border border-dark/15 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:opacity-50 focus:border-dark/40 md:col-span-2 dark:bg-dark/10 dark:focus:border-light/40"
                  value={block.caption ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      "caption",
                      event.target.value || undefined
                    )
                  }
                  placeholder="Caption"
                />
              </div>
            </BlockCard>
          ))}
        </div>
      </section>
    </div>
  );
}
