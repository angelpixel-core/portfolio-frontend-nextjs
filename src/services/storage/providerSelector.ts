import "server-only";

import localDiskProvider from "./localDiskProvider";
import type { StorageProvider } from "./provider";

export const getStorageProvider = async (): Promise<StorageProvider> => {
  if (process.env.NODE_ENV !== "production") {
    return localDiskProvider;
  }

  const { default: vercelBlobProvider } = await import("./vercelBlobProvider");
  return vercelBlobProvider;
};
