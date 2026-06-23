import "server-only";

import { getStorageProvider } from "./providerSelector";

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const normalizeName = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const getArticleImageAllowedTypes = (): Set<string> => {
  const raw = process.env.ARTICLE_IMAGE_ALLOWED_TYPES?.trim();
  if (!raw) return DEFAULT_ALLOWED_MIME_TYPES;

  const values = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return values.length > 0 ? new Set(values) : DEFAULT_ALLOWED_MIME_TYPES;
};

export const getArticleImageMaxBytes = (): number => {
  const raw = process.env.ARTICLE_IMAGE_MAX_BYTES;
  const value = raw ? Number(raw) : Number.NaN;
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_MAX_BYTES;
  }
  return Math.floor(value);
};

export const isValidArticleImageType = (contentType: string): boolean =>
  getArticleImageAllowedTypes().has(contentType.toLowerCase());

export const buildArticleImagePathname = (
  articleId: number,
  fileName: string,
  now = new Date()
): string => {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const safeName = normalizeName(fileName || "image");
  return `articles/${articleId}/${stamp}-${safeName}`;
};

export const uploadArticleImage = async (params: {
  articleId: number;
  fileName: string;
  contentType: string;
  bytes: Uint8Array;
}) => {
  const pathname = buildArticleImagePathname(params.articleId, params.fileName);
  const provider = await getStorageProvider();
  return provider.uploadPublicImage({
    bytes: params.bytes,
    contentType: params.contentType,
    pathname,
  });
};
