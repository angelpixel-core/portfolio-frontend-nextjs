import "server-only";

import { join, resolve, sep } from "path";

export const getLocalMediaAbsoluteRoot = (): string =>
  resolve(process.cwd(), join(".private", "media"));

export const getLocalMediaPublicUrl = (pathname: string): string =>
  `/media/${pathname.replace(/^\/+/, "")}`;

export const normalizeLocalMediaPath = (pathname: string): string | null => {
  const cleaned = pathname.replace(/^\/+/, "");
  if (!cleaned) return null;

  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  for (const part of parts) {
    if (part === "." || part === "..") return null;
    if (part.includes("\\") || part.includes("\0")) return null;
  }

  return parts.join("/");
};

export const resolveLocalMediaPath = (pathname: string): string | null => {
  const normalized = normalizeLocalMediaPath(pathname);
  if (!normalized) return null;

  const root = getLocalMediaAbsoluteRoot();
  const absolutePath = resolve(root, normalized);
  const rootPrefix = `${root}${sep}`;

  if (absolutePath !== root && !absolutePath.startsWith(rootPrefix)) {
    return null;
  }

  return absolutePath;
};

export const getLocalMediaMetaPath = (pathname: string): string | null => {
  const absolutePath = resolveLocalMediaPath(pathname);
  return absolutePath ? `${absolutePath}.meta.json` : null;
};
