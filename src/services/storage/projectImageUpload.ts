import "server-only";

import vercelBlobProvider from "./vercelBlobProvider";
import {
  getArticleImageAllowedTypes,
  getArticleImageMaxBytes,
  isValidArticleImageType,
} from "./articleImageUpload";

const normalizeName = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const getProjectImageAllowedTypes = getArticleImageAllowedTypes;
export const getProjectImageMaxBytes = getArticleImageMaxBytes;
export const isValidProjectImageType = isValidArticleImageType;

export const buildProjectImagePathname = (
  projectId: number,
  fileName: string,
  now = new Date()
): string => {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const safeName = normalizeName(fileName || "image");
  return `projects/${projectId}/${stamp}-${safeName}`;
};

export const uploadProjectImage = async (params: {
  projectId: number;
  fileName: string;
  contentType: string;
  bytes: Uint8Array;
}) => {
  const pathname = buildProjectImagePathname(params.projectId, params.fileName);
  return vercelBlobProvider.uploadPublicImage({
    bytes: params.bytes,
    contentType: params.contentType,
    pathname,
  });
};
