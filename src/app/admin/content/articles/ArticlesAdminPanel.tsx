"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Article } from "@/domains/article/model/schema";
import { isStaticContentMode } from "@/lib/content-mode";

type SaveState = "idle" | "saving" | "saved" | "error";
type ActionState = "idle" | "publishing" | "published" | "error";
type EditableArticle = Article & { saveState: SaveState };

const articleUrlFromSlug = (slug: string): string => `/articles/${slug.trim()}`;

const byDateDesc = (a: Article, b: Article) =>
  new Date(b.published_at).getTime() - new Date(a.published_at).getTime();

const createDraftArticle = (): EditableArticle => ({
  id: 0,
  title: "",
  url: "",
  slug: "",
  lang: "ES",
  reading_time: 0,
  published_at: new Date().toISOString().split("T")[0],
  summary: "",
  content: "",
  img: "",
  img_alt: undefined,
  hero_asset_id: undefined,
  blocks: [],
  featured: false,
  visible: true,
  priority: 0,
  category: undefined,
  badges: [],
  status: "draft",
  saveState: "idle",
});

export default function ArticlesAdminPanel(): JSX.Element {
  const router = useRouter();
  const [items, setItems] = useState<EditableArticle[]>([]);
  const [draft, setDraft] = useState<EditableArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStateById, setActionStateById] = useState<
    Record<number, ActionState>
  >({});
  const readOnly = isStaticContentMode();

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

  const updateDraftField = <K extends keyof EditableArticle>(
    key: K,
    value: EditableArticle[K]
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;

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

  const startNewArticle = () => {
    setDraft(createDraftArticle());
  };

  const cancelNewArticle = () => {
    setDraft(null);
  };

  const todayIso = () => new Date().toISOString().split("T")[0];

  const saveDraftArticle = async () => {
    if (!draft) return;

    const currentDraft = draft;
    setDraft({ ...currentDraft, saveState: "saving" });

    try {
      const response = await fetch("/api/admin/content/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentDraft,
          url: articleUrlFromSlug(currentDraft.slug),
        }),
      });

      const data = (await response.json()) as { ok: boolean; item?: Article };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not create article");
      }

      setDraft(null);
      router.push(
        `/admin/content/articles/${data.item.id}#hero-upload-${data.item.id}`
      );
    } catch {
      setDraft((prev) => (prev ? { ...prev, saveState: "error" } : prev));
    }
  };

  const publishItem = async (id: number) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;

    setActionStateById((prev) => ({ ...prev, [id]: "publishing" }));

    const publishedAt = current.published_at?.trim() || todayIso();
    const payload = {
      ...current,
      status: "published" as const,
      visible: true,
      published_at: publishedAt,
      url: articleUrlFromSlug(current.slug),
    };

    try {
      const response = await fetch(`/api/admin/content/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; item?: Article };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not publish article");
      }

      const saved = data.item as Article;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...saved, saveState: "idle" } : item
        )
      );
      setActionStateById((prev) => ({ ...prev, [id]: "published" }));
      window.setTimeout(
        () =>
          setActionStateById((prev) => ({
            ...prev,
            [id]: "idle",
          })),
        1200
      );
    } catch {
      setActionStateById((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  if (loading) return <p className="text-sm opacity-80">Loading articles...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {readOnly ? (
        <p className="text-xs opacity-70">
          Static content mode: editing is disabled.
        </p>
      ) : null}

      <fieldset disabled={readOnly} className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <div>
            <h3 className="text-lg font-semibold">Article draft</h3>
            <p className="text-sm opacity-80">
              Create a new article without persisting it until you save.
            </p>
          </div>
          <button
            type="button"
            className="rounded bg-dark px-3 py-2 text-sm text-light dark:bg-light dark:text-dark"
            onClick={startNewArticle}
            disabled={Boolean(draft)}
          >
            New article
          </button>
        </div>

        {draft ? (
          <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">Unsaved article</h3>
                <p className="text-sm opacity-80">
                  Fill the basics now and continue in the detail view after
                  saving.
                </p>
              </div>
              <span className="text-xs opacity-70">Draft</span>
            </div>

            <div className="grid gap-3 tablet:grid-cols-2">
              <label className="space-y-1 text-sm tablet:col-span-1">
                <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                  Title
                </span>
                <input
                  className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={draft.title}
                  onChange={(event) =>
                    updateDraftField("title", event.target.value)
                  }
                  placeholder="Untitled article"
                />
                <span className="block text-xs opacity-60">
                  Shown in the article header and admin list.
                </span>
              </label>
              <label className="space-y-1 text-sm tablet:col-span-1">
                <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                  Slug
                </span>
                <input
                  className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={draft.slug}
                  onChange={(event) =>
                    updateDraftField("slug", event.target.value)
                  }
                  placeholder="new-article"
                />
                <span className="block text-xs opacity-60">
                  Used in the public URL path.
                </span>
              </label>
              <div className="space-y-1 text-sm tablet:col-span-1">
                <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                  URL
                </span>
                <div className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm">
                  {draft.slug ? articleUrlFromSlug(draft.slug) : "/articles/"}
                </div>
                <span className="block text-xs opacity-60">
                  Derived from the slug.
                </span>
              </div>
              <label className="space-y-1 text-sm tablet:col-span-1">
                <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                  Reading time
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={draft.reading_time}
                  onChange={(event) =>
                    updateDraftField(
                      "reading_time",
                      event.currentTarget.valueAsNumber || 0
                    )
                  }
                  placeholder="0"
                />
                <span className="block text-xs opacity-60">
                  Minutes only. The UI adds the `min read` label.
                </span>
              </label>
              <label className="space-y-1 text-sm tablet:col-span-1">
                <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                  Published date
                </span>
                <input
                  type="date"
                  className="w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={draft.published_at}
                  onChange={(event) =>
                    updateDraftField("published_at", event.target.value)
                  }
                  placeholder="YYYY-MM-DD"
                />
                <span className="block text-xs opacity-60">
                  Drafts can still keep a publish date for later.
                </span>
              </label>
              <label className="space-y-1 text-sm tablet:col-span-2">
                <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                  Summary
                </span>
                <textarea
                  className="min-h-[96px] w-full rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
                  value={draft.summary}
                  onChange={(event) =>
                    updateDraftField("summary", event.target.value)
                  }
                  placeholder="Short summary for cards and previews"
                />
                <span className="block text-xs opacity-60">
                  Keep this concise for the blog list.
                </span>
              </label>
              <div className="rounded border border-dark/20 px-3 py-2 text-sm tablet:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                  Hero image
                </p>
                <p className="mt-2 text-xs opacity-60">
                  You can attach the hero after saving this draft and opening
                  the detail editor.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="rounded bg-dark px-3 py-2 text-sm text-light dark:bg-light dark:text-dark"
                onClick={saveDraftArticle}
              >
                Save and open
              </button>
              <button
                type="button"
                className="rounded border border-dark/20 px-3 py-2 text-sm"
                onClick={cancelNewArticle}
              >
                Cancel
              </button>
              <span className="text-xs opacity-80">
                {draft.saveState === "saving" && "Creating..."}
                {draft.saveState === "error" && "Create failed"}
              </span>
            </div>
          </article>
        ) : null}

        <section className="overflow-hidden rounded-lg border border-dark/20 dark:border-light/20">
          <div className="border-b border-dark/10 p-4 dark:border-light/10">
            <h3 className="text-lg font-semibold">Articles</h3>
            <p className="text-sm opacity-80">
              Admin table with quick access to details and publish.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark/10 text-sm dark:divide-light/10">
              <thead className="bg-dark/5 text-left uppercase tracking-wide dark:bg-light/5">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Visible</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/10 dark:divide-light/10">
                {sorted.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="px-4 py-4 font-medium">#{item.id}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="max-w-[36rem] text-xs opacity-70">
                          {item.summary}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs opacity-80">
                      {item.slug}
                    </td>
                    <td className="px-4 py-4 text-xs opacity-80">
                      {item.published_at || "unset"}
                    </td>
                    <td className="px-4 py-4 text-xs capitalize">
                      {item.status ?? "published"}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {item.visible === false ? "no" : "yes"}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {item.featured ? "yes" : "no"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/content/articles/${item.id}`}
                          className="rounded border border-dark/20 px-3 py-1.5 text-xs font-medium hover:bg-dark/5 dark:hover:bg-light/10"
                        >
                          details
                        </Link>
                        <button
                          type="button"
                          className="rounded bg-dark px-3 py-1.5 text-xs font-medium text-light disabled:cursor-not-allowed disabled:opacity-40 dark:bg-light dark:text-dark"
                          onClick={() => publishItem(item.id)}
                          disabled={actionStateById[item.id] === "publishing"}
                        >
                          {actionStateById[item.id] === "publishing"
                            ? "publishing..."
                            : "publish"}
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] opacity-70">
                        {actionStateById[item.id] === "published"
                          ? "Published"
                          : null}
                        {actionStateById[item.id] === "error"
                          ? "Publish failed"
                          : null}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </fieldset>
    </div>
  );
}
