import { db } from "../../src/db";
import {
  contentArticles,
  contentProjects,
  contentWordCloudConcepts,
} from "../../src/db/schema";
import projectsMock from "../../src/domains/project/model/mock";
import articlesMock from "../../src/domains/article/model/mock";
import wordCloudConceptsMock from "../../src/domains/word-cloud/model/mock";

const seedProjects = async (): Promise<void> => {
  for (const item of projectsMock) {
    await db
      .insert(contentProjects)
      .values({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        description: item.description,
        technologies: item.technologies,
        outcomes: item.outcomes ?? null,
        technicalHighlights: item.technicalHighlights ?? null,
        sections: item.sections ?? null,
        demo: item.demo ?? null,
        repository: item.repository ?? null,
        img: item.img,
        screenshots: item.screenshots ?? null,
        tags: item.tags,
        featured: item.featured,
        visible: item.visible,
        priority: item.priority,
        status: item.status,
        featuredCard: item.featuredCard ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: contentProjects.id,
        set: {
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          description: item.description,
          technologies: item.technologies,
          outcomes: item.outcomes ?? null,
          technicalHighlights: item.technicalHighlights ?? null,
          sections: item.sections ?? null,
          demo: item.demo ?? null,
          repository: item.repository ?? null,
          img: item.img,
          screenshots: item.screenshots ?? null,
          tags: item.tags,
          featured: item.featured,
          visible: item.visible,
          priority: item.priority,
          status: item.status,
          featuredCard: item.featuredCard ?? null,
          updatedAt: new Date(),
        },
      });
  }
};

const seedArticles = async (): Promise<void> => {
  for (const item of articlesMock) {
    await db
      .insert(contentArticles)
      .values({
        id: item.id,
        title: item.title,
        url: item.url,
        slug: item.slug,
        lang: item.lang,
        readingTime: item.reading_time,
        publishedAt: item.published_at,
        summary: item.summary,
        content: item.content ?? null,
        img: item.img,
        imgAlt: item.img_alt ?? null,
        featured: item.featured,
        visible: item.visible ?? true,
        priority: item.priority ?? 0,
        category: item.category ?? null,
        badges: item.badges ?? null,
        status: item.status ?? "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: contentArticles.id,
        set: {
          title: item.title,
          url: item.url,
          slug: item.slug,
          lang: item.lang,
          readingTime: item.reading_time,
          publishedAt: item.published_at,
          summary: item.summary,
          content: item.content ?? null,
          img: item.img,
          imgAlt: item.img_alt ?? null,
          featured: item.featured,
          visible: item.visible ?? true,
          priority: item.priority ?? 0,
          category: item.category ?? null,
          badges: item.badges ?? null,
          status: item.status ?? "published",
          updatedAt: new Date(),
        },
      });
  }
};

const seedWordCloud = async (): Promise<void> => {
  for (const item of wordCloudConceptsMock) {
    await db
      .insert(contentWordCloudConcepts)
      .values({
        id: item.id,
        label: item.label,
        weight: item.weight,
        description: item.description,
        relatedKeywords: item.relatedKeywords,
        technologies: item.technologies,
        companies: item.companies,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: contentWordCloudConcepts.id,
        set: {
          label: item.label,
          weight: item.weight,
          description: item.description,
          relatedKeywords: item.relatedKeywords,
          technologies: item.technologies,
          companies: item.companies,
          updatedAt: new Date(),
        },
      });
  }
};

const main = async (): Promise<void> => {
  await seedProjects();
  await seedArticles();
  await seedWordCloud();
  console.log("Content admin seed complete");
};

main().catch((error) => {
  console.error("Content admin seed failed", error);
  process.exit(1);
});
