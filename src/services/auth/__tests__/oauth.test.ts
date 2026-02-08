import { performLogout } from "../oauth";
import { mockLogout } from "../mock";

jest.mock("../mock", () => ({
  mockLogout: jest.fn(),
  mockOAuthLogin: jest.fn(),
}));

describe("performLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls mockLogout and returns success result", async () => {
    (mockLogout as jest.Mock).mockResolvedValue({
      success: true,
    });

    const result = await performLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });

  it("returns error result when mockLogout fails", async () => {
    (mockLogout as jest.Mock).mockResolvedValue({
      success: false,
      error: "Logout failed",
    });

    const result = await performLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: false, error: "Logout failed" });
  });
});
