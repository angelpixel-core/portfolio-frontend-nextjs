"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import type { JobExperience } from "@/domains/job-experience/model";

type SaveState = "idle" | "saving" | "saved" | "error";

type EditableExperience = JobExperience & {
  contextBadgesText: string;
  technologiesText: string;
  workText: string;
  saveState: SaveState;
};

const toWorkText = (item: JobExperience): string => {
  return (item.work ?? [])
    .map((task) => {
      const tags = (task.tags ?? []).join(", ");
      return tags ? `${task.description} | ${tags}` : task.description;
    })
    .join("\n");
};

const parseCsv = (value: string): string[] => {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
};

const parseWork = (value: string): JobExperience["work"] => {
  const rows = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return [];
  }

  return rows.map((row) => {
    const [descriptionPart, tagsPart] = row
      .split("|")
      .map((part) => part.trim());
    const tags = parseCsv(tagsPart ?? "");
    return {
      description: descriptionPart,
      ...(tags.length > 0 ? { tags } : {}),
    };
  });
};

const toEditable = (item: JobExperience): EditableExperience => ({
  ...item,
  contextBadgesText: item.contextBadges.join(", "),
  technologiesText: item.technologies.join(", "),
  workText: toWorkText(item),
  saveState: "idle",
});

export default function JobExperiencesAdminPanel(): JSX.Element {
  const [items, setItems] = useState<EditableExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/content/job-experiences");
        const data = (await response.json()) as {
          ok: boolean;
          items?: JobExperience[];
        };

        if (!response.ok || !data.ok || !data.items) {
          throw new Error("Could not load job experiences");
        }

        if (!active) return;
        setItems(data.items.map(toEditable));
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

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.id - b.id),
    [items]
  );

  const updateField = <K extends keyof EditableExperience>(
    id: number,
    key: K,
    value: EditableExperience[K]
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

    const payload: JobExperience = {
      id: current.id,
      publish: current.publish,
      position: current.position,
      company: current.company,
      companyLink: current.companyLink,
      time: current.time,
      year: current.year,
      address: current.address,
      contextBadges: parseCsv(current.contextBadgesText),
      technologies: parseCsv(current.technologiesText),
      group: current.group,
      work: parseWork(current.workText),
    };

    try {
      const response = await fetch(`/api/admin/content/job-experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        ok: boolean;
        item?: JobExperience;
      };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not save job experience");
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...toEditable(data.item as JobExperience), saveState: "saved" }
            : item
        )
      );
      window.setTimeout(() => updateField(id, "saveState", "idle"), 1400);
    } catch {
      updateField(id, "saveState", "error");
    }
  };

  if (loading) {
    return <p className="text-sm opacity-80">Loading job experiences...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => (
        <article
          key={item.id}
          className="rounded-lg border border-dark/20 p-4 dark:border-light/20"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">#{item.id}</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(item.publish)}
                onChange={(event) =>
                  updateField(item.id, "publish", event.target.checked)
                }
              />
              Published
            </label>
          </div>

          <div className="grid gap-3 tablet:grid-cols-2">
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.position}
              onChange={(event) =>
                updateField(item.id, "position", event.target.value)
              }
              placeholder="Position"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.company}
              onChange={(event) =>
                updateField(item.id, "company", event.target.value)
              }
              placeholder="Company"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.companyLink}
              onChange={(event) =>
                updateField(item.id, "companyLink", event.target.value)
              }
              placeholder="Company link"
            />
            <select
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.group}
              onChange={(event) =>
                updateField(
                  item.id,
                  "group",
                  event.target.value as JobExperience["group"]
                )
              }
            >
              <option value="engineering">engineering</option>
              <option value="platform">platform</option>
            </select>
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.time}
              onChange={(event) =>
                updateField(item.id, "time", event.target.value)
              }
              placeholder="Time"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.year}
              onChange={(event) =>
                updateField(item.id, "year", event.target.value)
              }
              placeholder="Year"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.address}
              onChange={(event) =>
                updateField(item.id, "address", event.target.value)
              }
              placeholder="Address"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.contextBadgesText}
              onChange={(event) =>
                updateField(item.id, "contextBadgesText", event.target.value)
              }
              placeholder="Context badges (comma separated)"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.technologiesText}
              onChange={(event) =>
                updateField(item.id, "technologiesText", event.target.value)
              }
              placeholder="Technologies (comma separated)"
            />
            <textarea
              className="min-h-[120px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.workText}
              onChange={(event) =>
                updateField(item.id, "workText", event.target.value)
              }
              placeholder="One task per line. Format: description | tag1,tag2"
            />
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
