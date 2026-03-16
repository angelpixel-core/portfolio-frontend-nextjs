import httpRequest from "@/lib/httpRequest";
import Content from "../index";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;
const ENV_KEY = "NEXT_PUBLIC_CONTENTS";

const ENV_CONTENTS = [
  {
    id: 1,
    title: "Env Title",
    slug: "landing",
    description: "Env description",
    mainContent: "Env main content",
  },
];

describe("Content model env-first sourcing", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify(ENV_CONTENTS);

    const result = await Content.fetchAll({ useMockFallback: true });

    expect(result).toEqual(ENV_CONTENTS);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("uses environment-content defaults when env is absent", async () => {
    const result = await Content.fetchAll();

    expect(result[0]?.slug).toBe("landing");
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify([
      {
        id: "bad-id",
        title: "Broken",
        slug: "landing",
        description: "Broken",
        mainContent: "Broken",
      },
    ]);

    await expect(Content.fetchAll()).rejects.toThrow();
    expect(httpRequest).not.toHaveBeenCalled();
  });
});
