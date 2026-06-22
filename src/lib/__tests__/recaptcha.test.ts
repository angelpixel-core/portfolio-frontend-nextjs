import { verifyRecaptchaToken } from "@/lib/recaptcha";

type MockResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

describe("verifyRecaptchaToken", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    process.env.RECAPTCHA_MIN_SCORE = "0.5";
    process.env.RECAPTCHA_BYPASS_LOCAL = "false";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetAllMocks();
  });

  it("returns ok for valid token and score", async () => {
    const response: MockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        score: 0.9,
        action: "chat_submit",
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(response);

    const result = await verifyRecaptchaToken("token", "chat_submit");

    expect(result.ok).toBe(true);
    expect(result.score).toBe(0.9);
    expect(result.action).toBe("chat_submit");
  });

  it("returns low score failure", async () => {
    const response: MockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        score: 0.1,
        action: "chat_submit",
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(response);

    const result = await verifyRecaptchaToken("token", "chat_submit");

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("low_score");
  });

  it("returns network error when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("boom"));

    const result = await verifyRecaptchaToken("token", "chat_submit");

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("network_error");
  });

  it("bypasses verification locally when enabled", async () => {
    process.env.RECAPTCHA_BYPASS_LOCAL = "true";

    const result = await verifyRecaptchaToken(undefined, "chat_submit");

    expect(result.ok).toBe(true);
    expect(result.action).toBe("chat_submit");
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
