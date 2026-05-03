import { NextResponse } from "next/server";

import model from "@/domains/job-experience/model";
import { logger } from "@/lib/logger";

export const GET = async () => {
  try {
    const experiences = await model.fetchAll({ publish: true });
    return NextResponse.json(experiences);
  } catch (error) {
    logger.error(
      "JobExperience",
      "Failed to fetch published experiences",
      error
    );
    return NextResponse.json(
      { message: "Failed to load job experiences" },
      { status: 500 }
    );
  }
};
