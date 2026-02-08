/**
 * Customer/Client Mock Data
 *
 * For the slider, customers can be configured via environment variable:
 * NEXT_PUBLIC_CUSTOMERS (JSON array)
 *
 * In production, this data comes from the backend API.
 *
 * @see .env.template for configuration
 */
import { logger } from "@/lib/logger";
import type { CustomersModel, SliderCustomersModel } from "./schema";

/**
 * Default customers for slider display
 * Used when NEXT_PUBLIC_CUSTOMERS is not set
 */
const defaultSliderCustomers: SliderCustomersModel = [
  { id: 1, name: "Compass", logo: "/images/customers/compass.png" },
  { id: 2, name: "SouthWorks", logo: "/images/customers/southworks.png" },
  { id: 3, name: "Nubi", logo: "/images/customers/nubi.png" },
  { id: 4, name: "Bitex", logo: "/images/customers/bitex.png" },
  { id: 5, name: "UNLP", logo: "/images/customers/unlp.png" },
];

/**
 * Get customers for slider from env or defaults
 */
export const getSliderCustomers = (): SliderCustomersModel => {
  const envCustomers = process.env.NEXT_PUBLIC_CUSTOMERS;

  if (envCustomers) {
    try {
      return JSON.parse(envCustomers) as SliderCustomersModel;
    } catch (e) {
      logger.warn(
        "Customer",
        "Failed to parse NEXT_PUBLIC_CUSTOMERS, using defaults"
      );
      return defaultSliderCustomers;
    }
  }

  return defaultSliderCustomers;
};

/**
 * Full customer data with experience details
 * Used for detailed views (e.g., Experience page)
 */
const customersMock: CustomersModel = [
  {
    id: 1,
    name: "Compass",
    company_type: "Real Estate Brokerage",
    url: "https://compass.com",
    logo: "/images/customers/compass.png",
    address: "New York, United States",
    experiences: [
      {
        position: "FullStack Engineer",
        start_date: "Dec 2021",
        end_date: "Aug 2022",
        outcomes: [
          "Code maintenance",
          "Feature flags",
          "Database optimization",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "SouthWorks",
    company_type: "Software Development",
    url: "https://southworks.com",
    logo: "/images/customers/southworks.png",
    address: "Delaware, United States",
    experiences: [
      {
        position: "Software Engineer L3",
        start_date: "May 2020",
        end_date: "Sept 2021",
        outcomes: ["Leadership", "Sprint planning", "Delivery milestones"],
      },
    ],
  },
];

export default customersMock;
