export {};

const ORIGINAL_ENV = process.env;

describe("WordCloud data env source", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_WORD_CLOUD_CONCEPTS;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("uses env concepts when NEXT_PUBLIC_WORD_CLOUD_CONCEPTS is valid JSON", async () => {
    process.env.NEXT_PUBLIC_WORD_CLOUD_CONCEPTS = JSON.stringify([
      {
        id: "custom-skill",
        label: "Custom Skill",
        weight: 4,
        description: "Custom description",
        relatedKeywords: ["Keyword A", "Keyword B"],
        technologies: [{ name: "TypeScript", icon: "TypeScriptIcon" }],
        companies: ["Acme"],
      },
    ]);

    const { CONCEPTS } = await import("../data");
    expect(CONCEPTS).toHaveLength(1);
    expect(CONCEPTS[0].id).toBe("custom-skill");
  });

  it("falls back to baseline concepts when NEXT_PUBLIC_WORD_CLOUD_CONCEPTS is malformed", async () => {
    process.env.NEXT_PUBLIC_WORD_CLOUD_CONCEPTS = "{invalid-json";

    const { CONCEPTS } = await import("../data");
    expect(CONCEPTS.length).toBeGreaterThan(1);
    expect(CONCEPTS[0].id).toBe("systems-design");
  });

  it("falls back to baseline concepts when env JSON shape is invalid", async () => {
    process.env.NEXT_PUBLIC_WORD_CLOUD_CONCEPTS = JSON.stringify([
      {
        id: "broken",
        label: "Broken",
      },
    ]);

    const { CONCEPTS } = await import("../data");
    expect(CONCEPTS.length).toBeGreaterThan(1);
    expect(CONCEPTS[0].id).toBe("systems-design");
  });
});
