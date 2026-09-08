import { NextResponse } from "next/server";

import { fetchJobExperiences } from "@/application/job-experience";
import { logger } from "@/lib/logger";

export const GET = async () => {
  try {
    const experiences = await fetchJobExperiences({ publish: true });
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
