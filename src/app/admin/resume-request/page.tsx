import React from "react";
import type { Metadata } from "next";

import resumeRequestLinkModel from "@/domains/resume-request-link/model";
import resumeRequestSubmissionModel from "@/domains/resume-request-submission/model";
import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";
import { getResumeRequestLinkState } from "@/services/resumeRequest/publicLink";
import AdminResumeRequestConsole from "./AdminResumeRequestConsole";

export const metadata: Metadata = {
  title: "Admin resume request | Angel Pixel",
  description: "Operations view for resume request links and submissions.",
};

export default async function AdminResumeRequestPage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.RESUME_REQUESTS_MANAGE);

  const [links, submissions] = await Promise.all([
    resumeRequestLinkModel.list(),
    resumeRequestSubmissionModel.list(),
  ]);

  return (
    <AdminResumeRequestConsole
      initialLinks={links.map((item) => ({
        id: item.id,
        recipientName: item.recipientName,
        ttlDays: item.ttlDays,
        expiresAt: item.expiresAt.toISOString(),
        usedAt: item.usedAt?.toISOString() ?? null,
        revokedAt: item.revokedAt?.toISOString() ?? null,
        createdByAdminEmail: item.createdByAdminEmail,
        createdAt: item.createdAt.toISOString(),
        state: getResumeRequestLinkState(item),
      }))}
      initialSubmissions={submissions.map((item) => ({
        id: item.id,
        linkId: item.linkId,
        email: item.email,
        name: item.name,
        context: item.context ?? null,
        role: item.role ?? null,
        company: item.company ?? null,
        notes: item.notes ?? null,
        status: item.status,
        origin: item.origin,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
