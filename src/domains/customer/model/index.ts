import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import {
  CustomersSchema,
  CustomerSchema,
  type CustomersModel,
  type CustomerModel,
} from "./schema";

const ENDPOINT = "customers";
const ENV_KEY = "NEXT_PUBLIC_CUSTOMERS";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Customer = {
  async fetchAll({
    useMockFallback: _useMockFallback = true,
  }: FetchOptions = {}): Promise<CustomersModel> {
    try {
      return await resolveContentSource({
        envKey: ENV_KEY,
        schema: CustomersSchema,
        endpoint: ENDPOINT,
      });
    } catch (error) {
      logger.error("Customer", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback: _useMockFallback = true }: FetchOptions = {}
  ): Promise<CustomerModel> {
    try {
      const customers = await Customer.fetchAll();
      const customer = customers.find((item) => item.id === id);
      if (!customer) {
        throw new Error(`Customer with id ${id} not found`);
      }
      return CustomerSchema.parse(customer);
    } catch (error) {
      logger.error("Customer", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Customer;
