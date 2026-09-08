"use client";

import React, { useEffect, useState } from "react";

import { isStaticContentMode } from "@/lib/content-mode";

type GeneralSettings = {
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  telegram: string;
  calendly: string;
  whatsapp: string;
};

const defaultSettings: GeneralSettings = {
  email: "",
  linkedin: "",
  github: "",
  twitter: "",
  telegram: "",
  calendly: "",
  whatsapp: "",
};

const fieldClassName =
  "mt-1 w-full rounded-md border border-dark/20 bg-light px-3 py-2 text-dark dark:border-light/20 dark:bg-dark dark:text-light";

export default function GeneralSettingsForm(): React.JSX.Element {
  const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const readOnly = isStaticContentMode();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/settings/general");
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }

        const payload = (await response.json()) as {
          ok: boolean;
          settings?: GeneralSettings;
        };

        if (!payload.ok || !payload.settings) {
          throw new Error("Invalid settings payload");
        }

        setSettings(payload.settings);
      } catch {
        setError("Unable to load general settings.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const onChange = (field: keyof GeneralSettings, value: string) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (readOnly) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSuccess("General settings updated.");
    } catch {
      setError("Unable to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm opacity-80">Loading settings...</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {readOnly ? (
        <p className="text-xs opacity-70">
          Static content mode: editing is disabled.
        </p>
      ) : null}

      <fieldset disabled={readOnly} className="grid gap-4 tablet:grid-cols-2">
        <label className="block text-sm">
          Email
          <input
            className={fieldClassName}
            type="email"
            value={settings.email}
            onChange={(event) => onChange("email", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          LinkedIn username
          <input
            className={fieldClassName}
            value={settings.linkedin}
            onChange={(event) => onChange("linkedin", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          GitHub username
          <input
            className={fieldClassName}
            value={settings.github}
            onChange={(event) => onChange("github", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          Twitter/X username
          <input
            className={fieldClassName}
            value={settings.twitter}
            onChange={(event) => onChange("twitter", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          Telegram username
          <input
            className={fieldClassName}
            value={settings.telegram}
            onChange={(event) => onChange("telegram", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          Calendly username
          <input
            className={fieldClassName}
            value={settings.calendly}
            onChange={(event) => onChange("calendly", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          WhatsApp phone
          <input
            className={fieldClassName}
            value={settings.whatsapp}
            onChange={(event) => onChange("whatsapp", event.target.value)}
            required
          />
        </label>
      </fieldset>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <button
        type="submit"
        disabled={readOnly || isSaving}
        className="rounded-md border border-dark/25 px-4 py-2 text-sm font-semibold hover:bg-dark/5 disabled:opacity-60 dark:border-light/25 dark:hover:bg-light/10"
      >
        {isSaving ? "Saving..." : "Save general settings"}
      </button>
    </form>
  );
}
