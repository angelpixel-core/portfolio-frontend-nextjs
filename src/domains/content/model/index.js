import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";

const ENDPOINT = "contents";

const Content = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("Content", "contents", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      logger.error("Content", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(id, { useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("Content", "content", { id, delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData.find((item) => item.id === id) || mockData[0];
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      logger.error("Content", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Content;
