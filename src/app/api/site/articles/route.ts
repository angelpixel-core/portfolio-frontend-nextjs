import { NextResponse } from "next/server";

import { getPublishedArticles } from "./shared";
import { logger } from "@/lib/logger";

export const GET = async () => {
  try {
    const articles = await getPublishedArticles();
    return NextResponse.json(articles);
  } catch (error) {
    logger.error("Article", "Failed to fetch published articles", error);
    return NextResponse.json(
      { message: "Failed to load articles" },
      { status: 500 }
    );
  }
};
