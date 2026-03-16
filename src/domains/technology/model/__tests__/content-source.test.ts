import httpRequest from "@/lib/httpRequest";
import Technology from "../index";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;
const ENV_KEY = "NEXT_PUBLIC_TECHNOLOGIES";

const ENV_TECHNOLOGIES = [
  { id: 1, name: "React", status: "active", x: "10vw", y: "0vw" },
];

const HTTP_TECHNOLOGIES = [
  { id: 2, name: "TypeScript", status: "active", x: "-6vw", y: "4vw" },
];

describe("Technology model env-first sourcing", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify(ENV_TECHNOLOGIES);

    const result = await Technology.fetchAll({ useMockFallback: true });

    expect(result).toEqual(ENV_TECHNOLOGIES);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("falls back to HTTP when env is absent", async () => {
    (httpRequest as jest.Mock).mockResolvedValue(HTTP_TECHNOLOGIES);

    const result = await Technology.fetchAll();

    expect(httpRequest).toHaveBeenCalledWith("technologies");
    expect(result).toEqual(HTTP_TECHNOLOGIES);
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify([
      { id: "bad-id", name: "Broken", status: "active", x: "0", y: "0" },
    ]);

    await expect(Technology.fetchAll()).rejects.toThrow();
    expect(httpRequest).not.toHaveBeenCalled();
  });
});
