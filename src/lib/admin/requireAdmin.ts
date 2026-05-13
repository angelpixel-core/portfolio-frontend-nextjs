import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";

export const requireAdmin = async (): Promise<void> => {
  await requirePermission(PERMISSIONS.ADMIN_PANEL_ACCESS);
};
