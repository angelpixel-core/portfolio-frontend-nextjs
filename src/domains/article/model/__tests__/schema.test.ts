import {
  ArticleBlockSchema,
  ArticleSchema,
  ArticlesSchema,
} from "../schema";

describe("ArticleSchema", () => {
  const validArticle = {
    id: 1,
    title: "Test Article",
    url: "/articles/test",
    slug: "test",
    lang: "EN",
    reading_time: "5 min read",
    published_at: "2023-03-22",
    summary: "A test article summary",
    img: "/images/test.jpg",
    featured: true,
    status: "published",
  };

  const validBlock = {
    id: "block-1",
    article_id: 1,
    sort_order: 0,
    block_type: "text",
    body: "Block body",
  };

  describe("valid articles", () => {
    it("parses valid article with all fields", () => {
      const result = ArticleSchema.safeParse(validArticle);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.title).toBe("Test Article");
        expect(result.data.slug).toBe("test");
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

    it("parses article with content field", () => {
      const withContent = {
        ...validArticle,
        content: "# Article Content\n\nThis is the full article content.",
      };
      const result = ArticleSchema.safeParse(withContent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe(
          "# Article Content\n\nThis is the full article content."
        );
      }
    });

    it("parses article without content (optional field)", () => {
      const withoutContent = { ...validArticle };
      delete (withoutContent as Record<string, unknown>).content;

      const result = ArticleSchema.safeParse(withoutContent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBeUndefined();
      }
    });

    it("parses article with slug derived from url", () => {
      const article = { ...validArticle, slug: "react-pagination" };
      const result = ArticleSchema.safeParse(article);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("react-pagination");
      }
    });

    it("parses article with normalized blocks", () => {
      const article = {
        ...validArticle,
        blocks: [validBlock],
      };

      const result = ArticleSchema.safeParse(article);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.blocks).toHaveLength(1);
        expect(result.data.blocks?.[0].block_type).toBe("text");
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

    it("fails when slug is missing", () => {
      const invalid = { ...validArticle };
      delete (invalid as Record<string, unknown>).slug;
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

describe("ArticleBlockSchema", () => {
  it("parses a valid text block", () => {
    const result = ArticleBlockSchema.safeParse({
      id: "block-1",
      article_id: 1,
      sort_order: 0,
      block_type: "text",
      title: "Section title",
      body: "Section body",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.block_type).toBe("text");
      expect(result.data.sort_order).toBe(0);
    }
  });

  it("allows image positioning metadata", () => {
    const result = ArticleBlockSchema.safeParse({
      id: "block-2",
      article_id: 1,
      sort_order: 1,
      block_type: "image",
      image_asset_id: "asset-1",
      image_position: "right",
      image_alt: "Example image",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image_position).toBe("right");
    }
  });

  it("rejects invalid block types", () => {
    const result = ArticleBlockSchema.safeParse({
      id: "block-3",
      article_id: 1,
      sort_order: 2,
      block_type: "gallery",
    });

    expect(result.success).toBe(false);
  });
});

describe("ArticlesSchema", () => {
  const validArticles = [
    {
      id: 1,
      title: "Article One",
      url: "/articles/one",
      slug: "one",
      lang: "EN",
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
      slug: "two",
      lang: "EN",
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
      expect(result.data[0].slug).toBe("one");
      expect(result.data[1].title).toBe("Article Two");
      expect(result.data[1].slug).toBe("two");
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
