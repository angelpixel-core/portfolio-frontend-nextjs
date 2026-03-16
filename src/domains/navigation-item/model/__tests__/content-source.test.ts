import httpRequest from "@/lib/httpRequest";
import NavigationItem from "../index";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;
const ENV_KEY = "NEXT_PUBLIC_NAV_ITEMS";

const ENV_ITEMS = [
  { id: 1, href: "/", name: "home" },
  { id: 2, href: "/about", name: "about" },
];

const HTTP_ITEMS = [{ id: 3, href: "/projects", name: "projects" }];

describe("Navigation item model env-first sourcing", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify(ENV_ITEMS);

    const result = await NavigationItem.fetchAll({ useMockFallback: true });

    expect(result).toEqual(ENV_ITEMS);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("falls back to HTTP when env is absent", async () => {
    (httpRequest as jest.Mock).mockResolvedValue(HTTP_ITEMS);

    const result = await NavigationItem.fetchAll();

    expect(httpRequest).toHaveBeenCalledWith("features");
    expect(result).toEqual(HTTP_ITEMS);
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify([
      { id: "bad-id", href: "/", name: "home" },
    ]);

    await expect(NavigationItem.fetchAll()).rejects.toThrow();
    expect(httpRequest).not.toHaveBeenCalled();
  });
});
