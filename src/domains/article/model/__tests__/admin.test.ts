import { memoryStore } from "../../../../db/memory-store";

describe("Article admin model", () => {
  beforeEach(() => {
    memoryStore.reset();
  });

  it("creates a draft article with a new id and safe defaults", async () => {
    const { default: articleAdminModel } = await import("../admin");

    const created = await articleAdminModel.createDraft({
      title: "",
      slug: "",
      url: "",
      reading_time: "",
      published_at: "",
      summary: "",
      img: "",
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.status).toBe("draft");
    expect(created.title).toBe("Untitled article");
    expect(created.slug).toBe(`new-article-${created.id}`);
    expect(created.url).toBe(`/articles/new-article-${created.id}`);
    expect(created.reading_time).toBe("0 min read");
    expect(created.published_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(
      memoryStore.getArticles().some((article) => article.id === created.id)
    ).toBe(true);
  });

  it("synthesizes a legacy text block from content when blocks are absent", async () => {
    const { default: articleAdminModel } = await import("../admin");

    memoryStore.setArticles([
      {
        id: 77,
        title: "Legacy article",
        url: "/articles/legacy-article",
        slug: "legacy-article",
        lang: "ES",
        reading_time: "3 min read",
        published_at: "2026-01-01",
        summary: "Legacy summary",
        content: "# Legacy content\n\nThis article still uses the old field.",
        img: "",
        featured: false,
        status: "published",
      },
    ]);

    const article = await articleAdminModel.fetchById(77);

    expect(article?.blocks).toHaveLength(1);
    expect(article?.blocks?.[0]).toMatchObject({
      block_type: "text",
      article_id: 77,
      sort_order: 0,
      body: "# Legacy content\n\nThis article still uses the old field.",
    });
  });
});
