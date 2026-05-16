import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";

export const metadata: Metadata = {
  title: "Admin settings | Angel Pixel",
  description: "Manage public contact and social settings.",
};

export default async function AdminSettingsPage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  redirect("/admin/content/profile");
}
