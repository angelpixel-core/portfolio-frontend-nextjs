import "server-only";

import { put } from "@vercel/blob";

import type { StorageProvider, UploadedPublicImage } from "./provider";

const ensureBlobToken = (): void => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("missing_blob_token");
  }
};

const vercelBlobProvider: StorageProvider = {
  async uploadPublicImage({ bytes, contentType, pathname }) {
    ensureBlobToken();

    const blob = await put(pathname, Buffer.from(bytes), {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    return {
      url: blob.url,
      key: blob.pathname,
    } satisfies UploadedPublicImage;
  },
};

export default vercelBlobProvider;
