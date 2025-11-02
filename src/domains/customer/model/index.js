import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "customers";

const Customer = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Customer.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for customers.");
        return mockData;
      }

      throw error;
    }
  },
};

export default Customer;
