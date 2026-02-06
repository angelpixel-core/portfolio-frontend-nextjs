import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import {
  CustomersSchema,
  CustomerSchema,
  type CustomersModel,
  type CustomerModel,
} from "./schema";

const ENDPOINT = "customers";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Customer = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<CustomersModel> {
    if (useMockFallback) {
      logger.mock("Customer", "customers", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return CustomersSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return CustomersSchema.parse(data);
    } catch (error) {
      logger.error("Customer", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback = true }: FetchOptions = {}
  ): Promise<CustomerModel> {
    if (useMockFallback) {
      logger.mock("Customer", "customer", { id, delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const customer = mockData.find((c) => c.id === id);
      if (!customer) {
        throw new Error(`Customer with id ${id} not found`);
      }
      return CustomerSchema.parse(customer);
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return CustomerSchema.parse(data);
    } catch (error) {
      logger.error("Customer", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Customer;
