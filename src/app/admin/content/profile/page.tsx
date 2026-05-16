import React from "react";
import type { Metadata } from "next";

import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";
import GeneralSettingsForm from "@/app/admin/settings/GeneralSettingsForm";

export const metadata: Metadata = {
  title: "Admin content profile | Angel Pixel",
  description: "Manage public profile and contact channels.",
};

export default async function AdminContentProfilePage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  return (
    <main className="text-dark dark:text-light">
      <header>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="mt-2 text-sm opacity-80">
          General public contact channels used across profile and navigation.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <h3 className="text-lg font-semibold">General</h3>
        <p className="mt-1 text-sm opacity-75">
          Edit LinkedIn, GitHub, Twitter/X, Telegram, Calendly, WhatsApp and
          contact email.
        </p>
        <div className="mt-4">
          <GeneralSettingsForm />
        </div>
      </section>
    </main>
  );
}
