import { NextResponse } from "next/server";

import model from "@/domains/contact-point/model";
import { logger } from "@/lib/logger";

export const GET = async () => {
  try {
    const contactPoints = await model.fetchAll({ visibleOnly: true });
    return NextResponse.json(contactPoints);
  } catch (error) {
    logger.error("ContactPoint", "Failed to fetch contact points", error);
    return NextResponse.json(
      { message: "Failed to load contact points" },
      { status: 500 }
    );
  }
};
