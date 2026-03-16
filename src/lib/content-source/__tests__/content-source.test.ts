import { z } from "zod";
import { ContentsSchema } from "@/domains/content/model/schema";
import { resolveContentSource } from "../index";
import httpRequest from "@/lib/httpRequest";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;

const SAMPLE_SCHEMA = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
  })
);

const SAMPLE_DATA = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Beta" },
];

describe("resolveContentSource", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env inline JSON when present and valid", async () => {
    process.env.TEST_ENV_KEY = JSON.stringify(SAMPLE_DATA);

    const result = await resolveContentSource({
      envKey: "TEST_ENV_KEY",
      schema: SAMPLE_SCHEMA,
      endpoint: "sample",
    });

    expect(result).toEqual(SAMPLE_DATA);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("resolves file references from environment-content registry", async () => {
    process.env.TEST_ENV_KEY = "file:contents.json";

    const result = await resolveContentSource({
      envKey: "TEST_ENV_KEY",
      schema: ContentsSchema,
      endpoint: "contents",
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]?.slug).toBe("landing");
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("throws for missing file references", async () => {
    process.env.TEST_ENV_KEY = "file:missing.json";

    await expect(
      resolveContentSource({
        envKey: "TEST_ENV_KEY",
        schema: SAMPLE_SCHEMA,
        endpoint: "sample",
      })
    ).rejects.toThrow("Environment content file not found");

    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("rejects file references outside environment-content", async () => {
    process.env.TEST_ENV_KEY = "file:../secrets.json";

    await expect(
      resolveContentSource({
        envKey: "TEST_ENV_KEY",
        schema: SAMPLE_SCHEMA,
        endpoint: "sample",
      })
    ).rejects.toThrow("Environment content file reference is invalid");

    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("throws on inline JSON parse errors", async () => {
    process.env.TEST_ENV_KEY = "{invalid-json";

    await expect(
      resolveContentSource({
        envKey: "TEST_ENV_KEY",
        schema: SAMPLE_SCHEMA,
        endpoint: "sample",
      })
    ).rejects.toThrow("Failed to parse inline JSON");

    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env.TEST_ENV_KEY = JSON.stringify([{ id: "bad" }]);

    await expect(
      resolveContentSource({
        envKey: "TEST_ENV_KEY",
        schema: SAMPLE_SCHEMA,
        endpoint: "sample",
      })
    ).rejects.toThrow();

    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("falls back to HTTP when env is absent", async () => {
    (httpRequest as jest.Mock).mockResolvedValue(SAMPLE_DATA);

    const result = await resolveContentSource({
      envKey: "TEST_ENV_KEY",
      schema: SAMPLE_SCHEMA,
      endpoint: "sample",
    });

    expect(httpRequest).toHaveBeenCalledWith("sample");
    expect(result).toEqual(SAMPLE_DATA);
  });
});
