import { NextResponse } from "next/server";

import { fetchPublicProfiles } from "@/application/profile";
import { logger } from "@/lib/logger";

export const GET = async () => {
  try {
    const profiles = await fetchPublicProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    logger.error("Profile", "Failed to fetch profiles", error);
    return NextResponse.json(
      { message: "Failed to load profiles" },
      { status: 500 }
    );
  }
};
