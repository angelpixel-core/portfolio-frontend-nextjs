"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import type { ProjectModel } from "@/domains/project/model/schema";

type SaveState = "idle" | "saving" | "saved" | "error";

type EditableProject = ProjectModel & { saveState: SaveState };

const byPriorityDesc = (a: ProjectModel, b: ProjectModel) =>
  b.priority - a.priority;

export default function ProjectsAdminPanel(): JSX.Element {
  const [items, setItems] = useState<EditableProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/content/projects");
        const data = (await response.json()) as {
          ok: boolean;
          items?: ProjectModel[];
        };

        if (!response.ok || !data.ok || !data.items) {
          throw new Error("Could not load projects");
        }

        if (!active) return;
        setItems(
          [...data.items]
            .sort(byPriorityDesc)
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

  const sorted = useMemo(() => [...items].sort(byPriorityDesc), [items]);

  const updateField = <K extends keyof EditableProject>(
    id: number,
    key: K,
    value: EditableProject[K]
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value, saveState: "idle" } : item
      )
    );
  };

  const saveProject = async (id: number) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;

    updateField(id, "saveState", "saving");

    try {
      const response = await fetch(`/api/admin/content/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });

      const data = (await response.json()) as {
        ok: boolean;
        item?: ProjectModel;
      };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not save project");
      }
      const savedItem = data.item as ProjectModel;

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...savedItem, saveState: "saved" } : item
        )
      );
      window.setTimeout(() => updateField(id, "saveState", "idle"), 1400);
    } catch {
      updateField(id, "saveState", "error");
    }
  };

  const reorderLocally = (id: number, direction: "up" | "down") => {
    const current = [...sorted];
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const [moved] = current.splice(index, 1);
    current.splice(targetIndex, 0, moved);

    const reprioritized = current.map((item, idx) => ({
      ...item,
      priority: current.length - idx,
      saveState: "idle" as const,
    }));
    setItems(reprioritized);
  };

  const persistReorder = async () => {
    try {
      const response = await fetch("/api/admin/content/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: sorted.map((item) => item.id) }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        items?: ProjectModel[];
      };

      if (!response.ok || !data.ok || !data.items) {
        throw new Error("Could not reorder projects");
      }

      setItems(
        data.items
          .sort(byPriorityDesc)
          .map((item) => ({ ...item, saveState: "idle" }))
      );
    } catch {
      setError("Could not save project order");
    }
  };

  if (loading) {
    return <p className="text-sm opacity-80">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          className="rounded bg-dark px-3 py-2 text-sm text-light dark:bg-light dark:text-dark"
          onClick={persistReorder}
        >
          Save order
        </button>
      </div>

      {sorted.map((item, index) => (
        <article
          key={item.id}
          className="rounded-lg border border-dark/20 p-4 dark:border-light/20"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">
              #{item.id} {item.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded border border-dark/20 px-2 py-1 text-xs"
                onClick={() => reorderLocally(item.id, "up")}
                disabled={index === 0}
              >
                Up
              </button>
              <button
                type="button"
                className="rounded border border-dark/20 px-2 py-1 text-xs"
                onClick={() => reorderLocally(item.id, "down")}
                disabled={index === sorted.length - 1}
              >
                Down
              </button>
            </div>
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
              value={item.tags}
              onChange={(event) =>
                updateField(item.id, "tags", event.target.value)
              }
              placeholder="Tags"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              type="number"
              value={item.priority}
              onChange={(event) =>
                updateField(
                  item.id,
                  "priority",
                  Number(event.target.value) || 0
                )
              }
              placeholder="Priority"
            />
            <select
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.status}
              onChange={(event) =>
                updateField(
                  item.id,
                  "status",
                  event.target.value as ProjectModel["status"]
                )
              }
            >
              <option value="planned">planned</option>
              <option value="in-progress">in-progress</option>
              <option value="live">live</option>
              <option value="shipped">shipped</option>
            </select>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(event) =>
                    updateField(item.id, "visible", event.target.checked)
                  }
                />{" "}
                Visible
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.featured}
                  onChange={(event) =>
                    updateField(item.id, "featured", event.target.checked)
                  }
                />{" "}
                Featured
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="rounded bg-dark px-3 py-2 text-sm text-light dark:bg-light dark:text-dark"
              onClick={() => saveProject(item.id)}
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
