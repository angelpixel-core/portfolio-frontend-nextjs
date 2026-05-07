import { asc, eq } from "drizzle-orm";

import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
import { logger } from "@/lib/logger";
import { ContactPointsSchema, type ContactPointsModel } from "./schema";

type FetchOptions = {
  visibleOnly?: boolean;
};

const ContactPoint = {
  async fetchAll({
    visibleOnly = true,
  }: FetchOptions = {}): Promise<ContactPointsModel> {
    if (isMemoryDriver()) {
      const rows = memoryStore.getContactPoints();
      const filtered = visibleOnly ? rows : rows;
      return ContactPointsSchema.parse(filtered);
    }

    try {
      const { db } = await import("../../../db");
      const { siteContactPoints } = await import("../../../db/schema");

      const rows = await db
        .select()
        .from(siteContactPoints)
        .where(visibleOnly ? eq(siteContactPoints.visible, true) : undefined)
        .orderBy(asc(siteContactPoints.sortOrder), asc(siteContactPoints.id));

      return ContactPointsSchema.parse(
        rows.map((row) => ({
          id: row.id,
          type: row.type,
          provider: row.provider,
          label: row.label,
          href: row.href,
          value: row.value,
          icon: row.icon,
        }))
      );
    } catch (error) {
      logger.error("ContactPoint", "fetchAll from DB failed", error);
      throw error;
    }
  },
};

export default ContactPoint;
