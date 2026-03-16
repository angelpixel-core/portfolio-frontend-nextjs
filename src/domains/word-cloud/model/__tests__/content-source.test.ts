import httpRequest from "@/lib/httpRequest";
import WordCloudModel, { WORD_CLOUD_ENV_KEY } from "../index";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;

const ENV_CONCEPTS = [
  {
    id: "concept-1",
    label: "Env Concept",
    weight: 3,
    description: "Env description",
    relatedKeywords: ["env"],
    technologies: [{ name: "React", icon: "react" }],
    companies: ["EnvCo"],
  },
];

const HTTP_CONCEPTS = [
  {
    id: "concept-2",
    label: "Http Concept",
    weight: 2,
    description: "Http description",
    relatedKeywords: ["http"],
    technologies: [{ name: "TypeScript", icon: "typescript" }],
    companies: ["HttpCo"],
  },
];

describe("Word cloud model env-first sourcing", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env content without HTTP fallback", async () => {
    process.env[WORD_CLOUD_ENV_KEY] = JSON.stringify(ENV_CONCEPTS);

    const result = await WordCloudModel.fetchAll({ useMockFallback: true });

    expect(result).toEqual(ENV_CONCEPTS);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("falls back to HTTP when env is absent", async () => {
    (httpRequest as jest.Mock).mockResolvedValue(HTTP_CONCEPTS);

    const result = await WordCloudModel.fetchAll();

    expect(httpRequest).toHaveBeenCalledWith("word-cloud-concepts");
    expect(result).toEqual(HTTP_CONCEPTS);
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env[WORD_CLOUD_ENV_KEY] = JSON.stringify([
      {
        id: "concept-bad",
        label: "Broken",
        weight: 10,
        description: "Broken",
        relatedKeywords: ["bad"],
        technologies: [{ name: "React", icon: "react" }],
        companies: ["BadCo"],
      },
    ]);

    await expect(WordCloudModel.fetchAll()).rejects.toThrow();
    expect(httpRequest).not.toHaveBeenCalled();
  });
});
