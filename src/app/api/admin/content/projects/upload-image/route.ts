import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";
import { isMemoryDriver } from "../../../../../../db/runtime";
import { memoryStore } from "../../../../../../db/memory-store";
import {
  getProjectImageMaxBytes,
  isValidProjectImageType,
  uploadProjectImage,
} from "@/services/storage/projectImageUpload";

const parseProjectId = (value: string | File | null): number | null => {
  if (typeof value !== "string") return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

type UploadFileLike = {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

const isUploadFileLike = (value: unknown): value is UploadFileLike => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UploadFileLike>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.size === "number" &&
    typeof candidate.arrayBuffer === "function"
  );
};

export const POST = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { ok: false, error: "invalid_form_data" },
      { status: 400 }
    );
  }

  const projectId = parseProjectId(formData.get("projectId"));
  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: "invalid_project_id" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!isUploadFileLike(file)) {
    return NextResponse.json(
      { ok: false, error: "file_required" },
      { status: 400 }
    );
  }

  if (!isValidProjectImageType(file.type)) {
    return NextResponse.json(
      { ok: false, error: "invalid_file_type" },
      { status: 400 }
    );
  }

  const maxBytes = getProjectImageMaxBytes();
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: "file_too_large", maxBytes },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await uploadProjectImage({
      projectId,
      fileName: file.name,
      contentType: file.type,
      bytes: new Uint8Array(arrayBuffer),
    });

    if (isMemoryDriver()) {
      const projects = memoryStore.getProjects();
      const idx = projects.findIndex((project) => project.id === projectId);
      if (idx !== -1) {
        projects[idx] = {
          ...projects[idx],
          img: uploaded.url,
        };
        memoryStore.setProjects(projects);
      }
    } else {
      const { db } = await import("../../../../../../db");
      const { contentAssets, contentProjects } =
        await import("../../../../../../db/schema");

      const provider = "vercel-blob";
      const providerKey = uploaded.key;
      const existingAsset = await db
        .select({ id: contentAssets.id })
        .from(contentAssets)
        .where(eq(contentAssets.providerKey, providerKey))
        .limit(1);

      const assetId =
        existingAsset[0]?.id ??
        `asset_project_${projectId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      if (!existingAsset[0]) {
        await db.insert(contentAssets).values({
          id: assetId,
          url: uploaded.url,
          provider,
          providerKey,
          mimeType: file.type,
          sizeBytes: file.size,
          alt: null,
        });
      } else {
        await db
          .update(contentAssets)
          .set({
            url: uploaded.url,
            mimeType: file.type,
            sizeBytes: file.size,
            updatedAt: new Date(),
          })
          .where(eq(contentAssets.id, assetId));
      }

      await db
        .update(contentProjects)
        .set({
          img: uploaded.url,
          heroAssetId: assetId,
          updatedAt: new Date(),
        })
        .where(eq(contentProjects.id, projectId));
    }

    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload_failed";
    const status = message === "missing_blob_token" ? 500 : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
};
