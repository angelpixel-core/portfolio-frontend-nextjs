export const PERMISSIONS = {
  ADMIN_PANEL_ACCESS: "admin.panel.access",
  CONTENT_READ: "content.read",
  CONTENT_WRITE: "content.write",
  ORDERS_MANAGE: "orders.manage",
  SUBSCRIPTIONS_MANAGE: "subscriptions.manage",
  RESUME_REQUESTS_MANAGE: "resume.requests.manage",
  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
