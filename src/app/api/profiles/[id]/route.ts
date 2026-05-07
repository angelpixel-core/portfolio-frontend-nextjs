import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import model from "@/domains/profile/model";
import { logger } from "@/lib/logger";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (_request: NextRequest, context: RouteContext) => {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isFinite(numericId) || numericId <= 0) {
      return NextResponse.json(
        { message: "Invalid profile id" },
        { status: 400 }
      );
    }

    const profile = await model.fetchById(numericId);
    return NextResponse.json(profile);
  } catch (error) {
    logger.error("Profile", "Failed to fetch profile by id", error);
    return NextResponse.json(
      { message: "Failed to load profile" },
      { status: 500 }
    );
  }
};
