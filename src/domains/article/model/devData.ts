import type { Articles } from "./schema";

export const getArticleDevData = async (): Promise<Articles> => {
  const mockModule = await import("./mock");
  return mockModule.default;
};
