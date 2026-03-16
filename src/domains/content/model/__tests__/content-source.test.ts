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

const HTTP_CONTENTS = [
  {
    id: 2,
    title: "Http Title",
    slug: "about",
    description: "Http description",
    mainContent: "Http main content",
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

  it("falls back to HTTP when env is absent", async () => {
    (httpRequest as jest.Mock).mockResolvedValue(HTTP_CONTENTS);

    const result = await Content.fetchAll();

    expect(httpRequest).toHaveBeenCalledWith("contents");
    expect(result).toEqual(HTTP_CONTENTS);
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
