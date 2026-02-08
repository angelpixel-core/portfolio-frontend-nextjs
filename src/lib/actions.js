import { logger } from "@/lib/logger";

// import { z } from "zod";
//
// const FormSchema = z.object({
//   id: z.string(),
//   email: z.string({
//     invalid_type_error: "Please send an contact email",
//   }),
//   date: z.string(),
// });
//
// const CreateUser = FormSchema.omit({ id: true, date: true });
export async function createUser(prevState, formData) {
  logger.debug("Actions", "Create User");

  const email = formData.get("email");

  // Validate Form using Zod
  // const validatedFields = CreateUser.safeParse({
  //   email: formData.get("email"),
  // });

  // if form validation fails, return errors early. Otherwise, continue
  // if (!validatedFields.success) {
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //     message: "Missing Fields. Failed to Create User.",
  //   };
  // }

  // Prepare data for insertion into the database
  // const { email } = validatedFields.data;

  const date = new Date().toISOString().split("T")[0];

  logger.debug("Actions", "Form data", { email, date });

  // Insert data into the database
  // try {
  //   await sql`
  //     INSERT INTO invoices (customer_id, amount, status, date)
  //     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  //   `;
  // } catch (error) {
  //   // If a database error occurs, return a more specific error.
  //   return {
  //     message: "Database error: Failed to Create Invoice.",
  //   };
  // }

  // Revalidate the cache for the invoices page and redirect the user.
  // revalidatePath("/dashboard/invoices");
  // redirect("/dashboard/invoices");
}
