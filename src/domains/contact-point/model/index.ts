import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { ContactPointsSchema, type ContactPointsModel } from "./schema";

const ENDPOINT = "social-networks";

interface FetchOptions {
  useMockFallback?: boolean;
}

const ContactPoint = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<ContactPointsModel> {
    if (useMockFallback) {
      logger.mock("ContactPoint", "contact points", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ContactPointsSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return ContactPointsSchema.parse(data);
    } catch (error) {
      logger.error("ContactPoint", "fetchAll failed", error);
      throw error;
    }
  },
};

export default ContactPoint;
