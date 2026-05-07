import { asc, eq } from "drizzle-orm";

import { db } from "../../../db";
import { siteContactPoints } from "../../../db/schema";
import { logger } from "@/lib/logger";
import { ContactPointsSchema, type ContactPointsModel } from "./schema";

type FetchOptions = {
  visibleOnly?: boolean;
};

const ContactPoint = {
  async fetchAll({
    visibleOnly = true,
  }: FetchOptions = {}): Promise<ContactPointsModel> {
    try {
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
