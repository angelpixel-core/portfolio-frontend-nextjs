import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getPublishedArticleBySlug } from "../../shared";
import { logger } from "@/lib/logger";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const GET = async (_request: NextRequest, context: RouteContext) => {
  try {
    const { slug } = await context.params;

    if (!slug.trim()) {
      return NextResponse.json(
        { message: "Invalid article slug" },
        { status: 400 }
      );
    }

    const article = await getPublishedArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    logger.error("Article", "Failed to fetch article by slug", error);
    return NextResponse.json(
      { message: "Failed to load article" },
      { status: 500 }
    );
  }
};
