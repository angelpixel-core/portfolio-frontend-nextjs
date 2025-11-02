import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "projects";

const Project = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Project.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for projects.");
        return mockData;
      }

      throw error;
    }
  },
};

export default Project;
