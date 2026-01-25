import { ArticleSchema, ArticlesSchema } from "../schema";

describe("ArticleSchema", () => {
  const validArticle = {
    id: 1,
    title: "Test Article",
    url: "/articles/test",
    reading_time: "5 min read",
    published_at: "2023-03-22",
    summary: "A test article summary",
    img: "/images/test.jpg",
    featured: true,
    status: "published",
  };

  describe("valid articles", () => {
    it("parses valid article with all fields", () => {
      const result = ArticleSchema.safeParse(validArticle);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.title).toBe("Test Article");
        expect(result.data.status).toBe("published");
      }
    });

    it("parses article without status (uses default 'published')", () => {
      const articleWithoutStatus = { ...validArticle };
      delete (articleWithoutStatus as Record<string, unknown>).status;

      const result = ArticleSchema.safeParse(articleWithoutStatus);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("published");
      }
    });

    it("parses article with status 'draft'", () => {
      const draftArticle = { ...validArticle, status: "draft" };
      const result = ArticleSchema.safeParse(draftArticle);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("draft");
      }
    });

    it("parses article with featured false", () => {
      const nonFeatured = { ...validArticle, featured: false };
      const result = ArticleSchema.safeParse(nonFeatured);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
      }
    });
  });

  describe("invalid articles", () => {
    it("fails when id is missing", () => {
      const invalid = { ...validArticle };
      delete (invalid as Record<string, unknown>).id;
      const result = ArticleSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails when title is missing", () => {
      const invalid = { ...validArticle };
      delete (invalid as Record<string, unknown>).title;
      const result = ArticleSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails when url is missing", () => {
      const invalid = { ...validArticle };
      delete (invalid as Record<string, unknown>).url;
      const result = ArticleSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails when status is invalid enum value", () => {
      const invalid = { ...validArticle, status: "archived" };
      const result = ArticleSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails when id is not a number", () => {
      const invalid = { ...validArticle, id: "one" };
      const result = ArticleSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails when featured is not a boolean", () => {
      const invalid = { ...validArticle, featured: "yes" };
      const result = ArticleSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});

describe("ArticlesSchema", () => {
  const validArticles = [
    {
      id: 1,
      title: "Article One",
      url: "/articles/one",
      reading_time: "5 min",
      published_at: "2023-03-22",
      summary: "Summary one",
      img: "/img/one.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Article Two",
      url: "/articles/two",
      reading_time: "10 min",
      published_at: "2023-03-15",
      summary: "Summary two",
      img: "/img/two.jpg",
      featured: false,
    },
  ];

  it("parses valid articles array", () => {
    const result = ArticlesSchema.safeParse(validArticles);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0].title).toBe("Article One");
      expect(result.data[1].title).toBe("Article Two");
    }
  });

  it("parses empty array", () => {
    const result = ArticlesSchema.safeParse([]);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
  });

  it("fails when array contains invalid article", () => {
    const invalidArray = [
      ...validArticles,
      { id: "invalid", title: "Bad Article" }, // missing required fields
    ];
    const result = ArticlesSchema.safeParse(invalidArray);
    expect(result.success).toBe(false);
  });
});
