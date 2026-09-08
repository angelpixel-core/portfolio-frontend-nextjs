import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { PERMISSIONS } from "@/application/authz";
import {
  getProjectImageMaxBytes,
  isValidProjectImageType,
  persistProjectImage,
  uploadProjectImage,
} from "@/application/content";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import { isStaticContentMode } from "@/lib/content-mode";

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
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.CONTENT_WRITE
  );

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  if (isStaticContentMode()) {
    return NextResponse.json(
      { ok: false, error: "read_only" },
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

    await persistProjectImage({
      projectId,
      fileType: file.type,
      fileSize: file.size,
      uploadedUrl: uploaded.url,
      uploadedKey: uploaded.key,
    });

    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload_failed";
    const status = message === "missing_blob_token" ? 500 : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
};
