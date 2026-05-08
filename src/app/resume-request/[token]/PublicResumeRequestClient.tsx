"use client";

import React, { useEffect, useMemo, useState } from "react";

type PublicBootstrapResponse = {
  ok: boolean;
  recipientName?: string;
  expiresAt?: string;
  error?: string;
};

type SubmitResponse = {
  ok: boolean;
  error?: string;
};

type FormState = {
  email: string;
  context: string;
  role: string;
  company: string;
  notes: string;
};

const INITIAL_FORM: FormState = {
  email: "",
  context: "",
  role: "",
  company: "",
  notes: "",
};

const getErrorMessage = (error?: string): string => {
  switch (error) {
    case "token_expired":
      return "This link has expired.";
    case "token_used":
      return "This link has already been used.";
    case "token_revoked":
      return "This link is no longer available.";
    case "invalid":
      return "Please review your input and try again.";
    default:
      return "This link is invalid or unavailable.";
  }
};

export default function PublicResumeRequestClient({
  token,
}: {
  token: string;
}): React.JSX.Element {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [recipientName, setRecipientName] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/resume-request/public/${token}`, {
        method: "GET",
        cache: "no-store",
      });
      const payload = (await response
        .json()
        .catch(() => null)) as PublicBootstrapResponse | null;

      if (cancelled) return;

      if (!response.ok || !payload?.ok || !payload.recipientName) {
        setError(getErrorMessage(payload?.error));
        setLoading(false);
        return;
      }

      setRecipientName(payload.recipientName);
      setExpiresAt(payload.expiresAt ?? "");
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const expiryLabel = useMemo(() => {
    if (!expiresAt) return null;

    const date = new Date(expiresAt);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }, [expiresAt]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || submitted) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      email: form.email.trim(),
      context: form.context.trim() || undefined,
      role: form.role.trim() || undefined,
      company: form.company.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    const response = await fetch(`/api/resume-request/public/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response
      .json()
      .catch(() => null)) as SubmitResponse | null;

    if (!response.ok || !result?.ok) {
      setError(getErrorMessage(result?.error));
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-2xl px-4 py-12 text-dark dark:text-light">
      <section className="rounded-2xl border border-dark/20 bg-light/80 p-6 shadow-sm dark:border-light/20 dark:bg-dark/40">
        <header>
          <p className="text-xs uppercase tracking-[0.18em] opacity-70">
            Resume Request
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Request a resume</h1>
          <p className="mt-2 text-sm opacity-80">
            Fill this short form and I will follow up by email.
          </p>
          {expiryLabel ? (
            <p className="mt-2 text-xs opacity-70">
              Link expires: {expiryLabel}
            </p>
          ) : null}
        </header>

        {loading ? (
          <div className="mt-8 rounded-lg border border-dark/15 p-4 text-sm opacity-80 dark:border-light/15">
            Validating link...
          </div>
        ) : null}

        {!loading && error ? (
          <div
            className="mt-8 rounded-lg border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {!loading && !error && submitted ? (
          <div className="mt-8 rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            Request sent successfully. Thank you.
          </div>
        ) : null}

        {!loading && !error && !submitted ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="email">
                Email <span className="opacity-70">(required)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark outline-none ring-0 transition focus:border-dark/50 dark:border-light/25 dark:bg-dark/60 dark:text-light"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={recipientName}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-dark/15 bg-dark/5 px-3 py-2 text-sm opacity-80 dark:border-light/20 dark:bg-light/10"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="context"
              >
                Context
              </label>
              <input
                id="context"
                name="context"
                type="text"
                value={form.context}
                onChange={handleChange}
                className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark outline-none ring-0 transition focus:border-dark/50 dark:border-light/25 dark:bg-dark/60 dark:text-light"
              />
            </div>

            <div className="grid gap-4 tablet:grid-cols-2">
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="role"
                >
                  Role
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark outline-none ring-0 transition focus:border-dark/50 dark:border-light/25 dark:bg-dark/60 dark:text-light"
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="company"
                >
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark outline-none ring-0 transition focus:border-dark/50 dark:border-light/25 dark:bg-dark/60 dark:text-light"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                value={form.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-dark/25 bg-white px-3 py-2 text-sm text-dark outline-none ring-0 transition focus:border-dark/50 dark:border-light/25 dark:bg-dark/60 dark:text-light"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-lg bg-dark px-4 py-2 text-sm font-medium text-light transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-light dark:text-dark"
            >
              {submitting ? "Sending..." : "Send request"}
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
