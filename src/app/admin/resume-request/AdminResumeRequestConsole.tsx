"use client";

import React, { useMemo, useState } from "react";

type LinkState = "active" | "used" | "revoked" | "expired";

type ResumeRequestLinkItem = {
  id: string;
  recipientName: string;
  ttlDays: number;
  expiresAt: string;
  usedAt?: string | null;
  revokedAt?: string | null;
  createdByAdminEmail: string;
  createdAt: string;
  state: LinkState;
};

type ResumeRequestSubmissionItem = {
  id: string;
  linkId: string;
  email: string;
  name: string;
  context?: string | null;
  role?: string | null;
  company?: string | null;
  notes?: string | null;
  status: string;
  origin: string;
  createdAt: string;
};

type Props = {
  initialLinks: ResumeRequestLinkItem[];
  initialSubmissions: ResumeRequestSubmissionItem[];
};

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const stateBadge = (state: LinkState): string => {
  if (state === "active") {
    return "bg-emerald-500/20 text-emerald-200 border border-emerald-300/30";
  }

  if (state === "used") {
    return "bg-sky-500/20 text-sky-200 border border-sky-300/30";
  }

  if (state === "expired") {
    return "bg-amber-500/20 text-amber-200 border border-amber-300/30";
  }

  return "bg-rose-500/20 text-rose-200 border border-rose-300/30";
};

export default function AdminResumeRequestConsole({
  initialLinks,
  initialSubmissions,
}: Props): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<"links" | "submissions">(
    "links"
  );
  const [links, setLinks] = useState<ResumeRequestLinkItem[]>(initialLinks);
  const [submissions] =
    useState<ResumeRequestSubmissionItem[]>(initialSubmissions);
  const [recipientName, setRecipientName] = useState("");
  const [ttlDays, setTtlDays] = useState("7");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const linksByDate = useMemo(() => {
    return [...links].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [links]);

  const handleCreateLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating) return;

    setCreating(true);
    setCreateError(null);
    setCreatedUrl(null);

    const numericTtl = Number(ttlDays);
    const payload = {
      recipientName: recipientName.trim(),
      ttlDays: Number.isFinite(numericTtl) ? numericTtl : undefined,
    };

    const response = await fetch("/api/admin/resume-request/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: boolean; item?: ResumeRequestLinkItem; publicUrl?: string }
      | { ok: boolean; error?: string }
      | null;

    if (!response.ok || !data || !data.ok || !("item" in data) || !data.item) {
      setCreateError("Could not create invite link. Please try again.");
      setCreating(false);
      return;
    }

    setLinks((prev) => [data.item!, ...prev]);
    setCreatedUrl(data.publicUrl ?? null);
    setRecipientName("");
    setTtlDays("7");
    setCreating(false);
  };

  const handleCopyUrl = async () => {
    if (!createdUrl) return;
    await navigator.clipboard.writeText(createdUrl);
  };

  const handleRevoke = async (id: string) => {
    const response = await fetch(
      `/api/admin/resume-request/links/${id}/revoke`,
      {
        method: "POST",
      }
    );

    const data = (await response.json().catch(() => null)) as {
      ok: boolean;
      item?: ResumeRequestLinkItem;
    } | null;

    if (!response.ok || !data?.ok || !data.item) return;

    setLinks((prev) =>
      prev.map((item) => (item.id === id ? data.item! : item))
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header>
        <h1 className="text-3xl font-semibold">Resume Request</h1>
        <p className="mt-2 text-sm opacity-80">
          Manage invite links and review incoming submissions.
        </p>
      </header>

      <section className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setActiveSection("links")}
          className={`rounded-md border px-3 py-1.5 text-sm ${
            activeSection === "links"
              ? "border-dark bg-dark text-light dark:border-light dark:bg-light dark:text-dark"
              : "border-dark/25 dark:border-light/30"
          }`}
        >
          Invite Links
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("submissions")}
          className={`rounded-md border px-3 py-1.5 text-sm ${
            activeSection === "submissions"
              ? "border-dark bg-dark text-light dark:border-light dark:bg-light dark:text-dark"
              : "border-dark/25 dark:border-light/30"
          }`}
        >
          Submissions
        </button>
      </section>

      {activeSection === "links" ? (
        <>
          <section className="mt-6 rounded-xl border border-dark/20 p-5 dark:border-light/20">
            <h2 className="text-lg font-semibold">Create Invite Link</h2>
            <form
              className="mt-4 grid gap-4 tablet:grid-cols-3"
              onSubmit={handleCreateLink}
            >
              <label className="block">
                <span className="mb-1 block text-sm">Recipient Name</span>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.target.value)}
                  className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark dark:border-light/25 dark:bg-dark/60 dark:text-light"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm">TTL Days</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={ttlDays}
                  onChange={(event) => setTtlDays(event.target.value)}
                  className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark dark:border-light/25 dark:bg-dark/60 dark:text-light"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-lg bg-dark px-4 py-2 text-sm font-medium text-light dark:bg-light dark:text-dark"
                >
                  {creating ? "Creating..." : "Create link"}
                </button>
              </div>
            </form>

            {createError ? (
              <p className="mt-3 text-sm text-rose-300" role="alert">
                {createError}
              </p>
            ) : null}

            {createdUrl ? (
              <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
                <p className="text-xs opacity-80">Public URL</p>
                <code className="mt-1 block break-all text-xs">
                  {createdUrl}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="mt-2 rounded-md border border-emerald-300/40 px-2 py-1 text-xs"
                >
                  Copy URL
                </button>
              </div>
            ) : null}
          </section>

          <section className="mt-6 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-dark/10 dark:bg-light/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Recipient</th>
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold">TTL</th>
                  <th className="px-4 py-3 font-semibold">Expires</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {linksByDate.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-dark/10 dark:border-light/10"
                  >
                    <td className="px-4 py-3">
                      <div>{item.recipientName}</div>
                      <div className="text-xs opacity-70">
                        {item.createdByAdminEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${stateBadge(
                          item.state
                        )}`}
                      >
                        {item.state}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.ttlDays} days</td>
                    <td className="px-4 py-3">
                      {formatDateTime(item.expiresAt)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={item.state !== "active"}
                        onClick={() => handleRevoke(item.id)}
                        className="rounded-md border border-rose-300/40 px-2 py-1 text-xs disabled:opacity-40"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <section className="mt-6 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-dark/10 dark:bg-light/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Details</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Origin</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-dark/10 dark:border-light/10"
                >
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-xs opacity-80">
                    <div>Context: {item.context ?? "-"}</div>
                    <div>Role: {item.role ?? "-"}</div>
                    <div>Company: {item.company ?? "-"}</div>
                    <div>Notes: {item.notes ?? "-"}</div>
                  </td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.origin}</td>
                  <td className="px-4 py-3">
                    {formatDateTime(item.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
