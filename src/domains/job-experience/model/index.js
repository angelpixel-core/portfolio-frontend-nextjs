import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "job-experiences";

const JobExperience = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 JobExperience.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for job experiences.");
        return mockData;
      }

      throw error;
    }
  },
};

export default JobExperience;
