import { z } from "zod";

/**
 * Customer/Client Schema
 *
 * Represents company clients with experience details.
 * Used for slider display and Experience page.
 */

// Experience within a customer engagement
export const CustomerExperienceSchema = z.object({
  position: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  outcomes: z.array(z.string()),
});

// Slider customer (minimal data for logo display)
export const SliderCustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
});

// Full customer with experience details
export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  company_type: z.string(),
  url: z.string().url(),
  logo: z.string(),
  address: z.string(),
  experiences: z.array(CustomerExperienceSchema),
});

export const CustomersSchema = z.array(CustomerSchema);
export const SliderCustomersSchema = z.array(SliderCustomerSchema);

// Inferred types from Zod schemas
export type CustomerExperience = z.infer<typeof CustomerExperienceSchema>;
export type SliderCustomer = z.infer<typeof SliderCustomerSchema>;
export type CustomerModel = z.infer<typeof CustomerSchema>;
export type CustomersModel = z.infer<typeof CustomersSchema>;
export type SliderCustomersModel = z.infer<typeof SliderCustomersSchema>;
