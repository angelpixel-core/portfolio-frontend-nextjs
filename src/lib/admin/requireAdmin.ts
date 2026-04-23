import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

export const requireAdmin = async (): Promise<void> => {
  const requestHeaders = await headers();
  const sessionEmail = await getAdminSessionEmail(requestHeaders);

  if (!sessionEmail) {
    redirect("/");
  }
};
