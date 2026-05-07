"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";

import type { Concept } from "@/domains/word-cloud/model/schema";

type SaveState = "idle" | "saving" | "saved" | "error";

type EditableConcept = Concept & {
  relatedKeywordsText: string;
  companiesText: string;
  technologiesText: string;
  saveState: SaveState;
};

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const toEditable = (item: Concept): EditableConcept => ({
  ...item,
  relatedKeywordsText: item.relatedKeywords.join(", "),
  companiesText: item.companies.join(", "),
  technologiesText: item.technologies
    .map((tech) => `${tech.name} | ${tech.icon}`)
    .join("\n"),
  saveState: "idle",
});

const parseTechnologies = (value: string): Concept["technologies"] => {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, icon] = line.split("|").map((part) => part.trim());
      return {
        name,
        icon: icon || name,
      };
    })
    .filter((item) => item.name.length > 0);
};

export default function WordCloudAdminPanel(): JSX.Element {
  const [items, setItems] = useState<EditableConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/content/word-cloud");
        const data = (await response.json()) as {
          ok: boolean;
          items?: Concept[];
        };

        if (!response.ok || !data.ok || !data.items) {
          throw new Error("Could not load word cloud concepts");
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

  const updateField = <K extends keyof EditableConcept>(
    id: string,
    key: K,
    value: EditableConcept[K]
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value, saveState: "idle" } : item
      )
    );
  };

  const saveItem = async (id: string) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;

    updateField(id, "saveState", "saving");

    const payload: Concept = {
      id: current.id,
      label: current.label,
      weight: current.weight,
      description: current.description,
      relatedKeywords: parseCsv(current.relatedKeywordsText),
      companies: parseCsv(current.companiesText),
      technologies: parseTechnologies(current.technologiesText),
    };

    try {
      const response = await fetch(`/api/admin/content/word-cloud/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; item?: Concept };
      if (!response.ok || !data.ok || !data.item) {
        throw new Error("Could not save concept");
      }

      const saved = data.item as Concept;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...toEditable(saved), saveState: "saved" } : item
        )
      );
      window.setTimeout(() => updateField(id, "saveState", "idle"), 1200);
    } catch {
      updateField(id, "saveState", "error");
    }
  };

  if (loading) return <p className="text-sm opacity-80">Loading concepts...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-lg border border-dark/20 p-4 dark:border-light/20"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">{item.id}</h3>
            <span className="text-xs opacity-70">weight: {item.weight}</span>
          </div>

          <div className="grid gap-3 tablet:grid-cols-2">
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              value={item.label}
              onChange={(event) =>
                updateField(item.id, "label", event.target.value)
              }
              placeholder="Label"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm"
              type="number"
              min={1}
              max={5}
              value={item.weight}
              onChange={(event) => {
                const next = Number(event.target.value);
                updateField(item.id, "weight", Number.isNaN(next) ? 1 : next);
              }}
              placeholder="Weight"
            />
            <textarea
              className="min-h-[80px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.description}
              onChange={(event) =>
                updateField(item.id, "description", event.target.value)
              }
              placeholder="Description"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.relatedKeywordsText}
              onChange={(event) =>
                updateField(item.id, "relatedKeywordsText", event.target.value)
              }
              placeholder="Related keywords (comma separated)"
            />
            <input
              className="rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.companiesText}
              onChange={(event) =>
                updateField(item.id, "companiesText", event.target.value)
              }
              placeholder="Companies (comma separated)"
            />
            <textarea
              className="min-h-[96px] rounded border border-dark/20 bg-transparent px-3 py-2 text-sm tablet:col-span-2"
              value={item.technologiesText}
              onChange={(event) =>
                updateField(item.id, "technologiesText", event.target.value)
              }
              placeholder="One technology per line: name | icon"
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
