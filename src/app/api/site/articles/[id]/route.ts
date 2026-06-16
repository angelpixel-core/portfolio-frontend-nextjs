import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getPublishedArticleById } from "../shared";
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
        { message: "Invalid article id" },
        { status: 400 }
      );
    }

    const article = await getPublishedArticleById(numericId);

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    logger.error("Article", "Failed to fetch article by id", error);
    return NextResponse.json(
      { message: "Failed to load article" },
      { status: 500 }
    );
  }
};
