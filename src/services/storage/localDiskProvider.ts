import "server-only";

import { dirname } from "path";
import { mkdir, writeFile } from "fs/promises";

import type { StorageProvider } from "./provider";
import {
  getLocalMediaMetaPath,
  getLocalMediaPublicUrl,
  resolveLocalMediaPath,
} from "./localMedia";

const localDiskProvider: StorageProvider = {
  async uploadPublicImage({ bytes, contentType, pathname }) {
    const absolutePath = resolveLocalMediaPath(pathname);
    if (!absolutePath) {
      throw new Error("invalid_local_media_path");
    }

    const metaPath = getLocalMediaMetaPath(pathname);
    if (!metaPath) {
      throw new Error("invalid_local_media_path");
    }

    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, Buffer.from(bytes));
    await writeFile(
      metaPath,
      JSON.stringify({ contentType, uploadedAt: new Date().toISOString() }),
      "utf8"
    );

    return {
      url: getLocalMediaPublicUrl(pathname),
      key: pathname,
    };
  },
};

export default localDiskProvider;
