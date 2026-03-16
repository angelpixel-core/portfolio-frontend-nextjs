import httpRequest from "@/lib/httpRequest";
import Profile from "../index";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;
const ENV_KEY = "NEXT_PUBLIC_PROFILES";

const ENV_PROFILES = [
  {
    id: 1,
    nickname: "env-profile",
    biography: ["Env biography"],
    avatar: "/images/profile/env.png",
    location: "Env Location",
    email: "env@example.com",
  },
];

describe("Profile model env-first sourcing", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify(ENV_PROFILES);

    const result = await Profile.fetchAll({ useMockFallback: true });

    expect(result).toEqual(ENV_PROFILES);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("uses environment-content defaults when env is absent", async () => {
    const result = await Profile.fetchAll();

    expect(result[0]?.nickname).toBe("portfolio-owner");
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify([
      {
        id: "bad-id",
        nickname: "broken-profile",
        biography: ["Broken"],
        avatar: "/images/profile/bad.png",
        location: "Bad",
        email: "bad@example.com",
      },
    ]);

    await expect(Profile.fetchAll()).rejects.toThrow();
    expect(httpRequest).not.toHaveBeenCalled();
  });
});
