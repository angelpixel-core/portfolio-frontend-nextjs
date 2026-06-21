"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import Link from "next/link";

import type { Article } from "@/domains/article/model/schema";

type SaveState = "idle" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "uploaded" | "error";
type EditableArticle = Article & { saveState: SaveState };

const byDateDesc = (a: Article, b: Article) =>
  new Date(b.published_at).getTime() - new Date(a.published_at).getTime();

export default function ArticlesAdminPanel(): JSX.Element {
  const [items, setItems] = useState<EditableArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStateById, setUploadStateById] = useState<
    Record<number, UploadState>
  >({});
  const [uploadErrorById, setUploadErrorById] = useState<
    Record<number, string>
  >({});

  const setUploadState = (articleId: number, state: UploadState) => {
    setUploadStateById((prev) => ({ ...prev, [articleId]: state }));
  };

  const setUploadError = (articleId: number, message: string) => {
    setUploadErrorById((prev) => ({ ...prev, [articleId]: message }));
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/content/articles");
        const data = (await response.json()) as {
          ok: boolean;
          items?: Article[];
        };

        if (!response.ok || !data.ok || !data.items) {
          throw new Error("Could not load articles");
        }

        if (!active) return;
        setItems(
          data.items
            .sort(byDateDesc)
            .map((item) => ({ ...item, saveState: "idle" }))
        );
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Unexpected error");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const sorted = useMemo(() => [...items].sort(byDateDesc), [items]);

  const updateField = <K extends keyof EditableArticle>(
    id: number,
    key: K,
    value: EditableArticle[K]
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value, saveState: "idle" } : item
      )
    );
  };

  const saveItem = async (id: number) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;

    updateField(id, "saveState", "saving");

    try {
      const response = await fetch(`/api/admin/content/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });

      const data = (await response.json()) as { ok: boolean; item?: Article };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not save article");
      }

      const saved = data.item as Article;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...saved, saveState: "saved" } : item
        )
      );
      window.setTimeout(() => updateField(id, "saveState", "idle"), 1200);
    } catch {
      updateField(id, "saveState", "error");
    }
  };

  const uploadImage = async (articleId: number, file: File | null) => {
    if (!file) return;

    setUploadState(articleId, "uploading");
    setUploadError(articleId, "");

    try {
      const formData = new FormData();
      formData.set("articleId", String(articleId));
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

      updateField(articleId, "img", data.url);
      setUploadState(articleId, "uploaded");
      window.setTimeout(() => setUploadState(articleId, "idle"), 1200);
    } catch (uploadError) {
      setUploadState(articleId, "error");
      setUploadError(
        articleId,
        uploadError instanceof Error ? uploadError.message : "upload_failed"
      );
    }
  };

  if (loading) return <p className="text-sm opacity-80">Loading articles...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {sorted.map((item) => (
        <article
          key={item.id}
          className="rounded-lg border border-dark/20 p-4 dark:border-light/20"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">
              <Link href={`/admin/content/articles/${item.id}`} className="underline">
                #{item.id}
              </Link>
            </h3>
            <span className="text-xs opacity-70">{item.slug}</span>
          </div>

          <div className="grid gap-3 tablet:grid-cols-2">
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.title}
              onChange={(event) =>
                updateField(item.id, "title", event.target.value)
              }
              placeholder="Title"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.slug}
              onChange={(event) =>
                updateField(item.id, "slug", event.target.value)
              }
              placeholder="Slug"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.url}
              onChange={(event) =>
                updateField(item.id, "url", event.target.value)
              }
              placeholder="URL"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.reading_time}
              onChange={(event) =>
                updateField(item.id, "reading_time", event.target.value)
              }
              placeholder="Reading time"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.published_at}
              onChange={(event) =>
                updateField(item.id, "published_at", event.target.value)
              }
              placeholder="Published at (YYYY-MM-DD)"
            />
            <select
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.status ?? "published"}
              onChange={(event) =>
                updateField(
                  item.id,
                  "status",
                  event.target.value as "published" | "draft"
                )
              }
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
            <textarea
              className="min-h-[96px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.summary}
              onChange={(event) =>
                updateField(item.id, "summary", event.target.value)
              }
              placeholder="Summary"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.img}
              onChange={(event) =>
                updateField(item.id, "img", event.target.value)
              }
              placeholder="Card/Main image URL"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.img_alt ?? ""}
              onChange={(event) =>
                updateField(item.id, "img_alt", event.target.value || undefined)
              }
              placeholder="Image alt text"
            />
            <div className="rounded border border-dark/20 px-3 py-2 text-sm tablet:col-span-2">
              <label
                className="mb-2 block text-xs opacity-80"
                htmlFor={`upload-${item.id}`}
              >
                Upload image to blob storage
              </label>
              <input
                id={`upload-${item.id}`}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null;
                  void uploadImage(item.id, file);
                  event.currentTarget.value = "";
                }}
              />
              <p className="mt-2 text-xs opacity-70">
                {uploadStateById[item.id] === "uploading" && "Uploading..."}
                {uploadStateById[item.id] === "uploaded" &&
                  "Uploaded and URL assigned"}
                {uploadStateById[item.id] === "error" &&
                  `Upload failed: ${uploadErrorById[item.id] ?? "unknown"}`}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm tablet:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(item.visible ?? true)}
                  onChange={(event) =>
                    updateField(item.id, "visible", event.target.checked)
                  }
                />
                Visible
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.featured}
                  onChange={(event) =>
                    updateField(item.id, "featured", event.target.checked)
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
              onClick={() => saveItem(item.id)}
            >
              Save
            </button>
            <span className="text-xs opacity-80">
              {item.saveState === "saving" && "Saving..."}
              {item.saveState === "saved" && "Saved"}
              {item.saveState === "error" && "Save failed"}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
