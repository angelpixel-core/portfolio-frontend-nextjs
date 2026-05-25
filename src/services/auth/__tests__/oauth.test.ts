import { performLogout } from "@/application/auth";

jest.mock("../mock", () => ({
  mockLogout: jest.fn(),
  mockOAuthLogin: jest.fn(),
}));

describe("performLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls mockLogout and returns success result", async () => {
    const { mockLogout } = jest.requireMock("../mock") as {
      mockLogout: jest.Mock;
    };
    mockLogout.mockResolvedValue({
      success: true,
    });

    const result = await performLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });

  it("returns error result when mockLogout fails", async () => {
    const { mockLogout } = jest.requireMock("../mock") as {
      mockLogout: jest.Mock;
    };
    mockLogout.mockResolvedValue({
      success: false,
      error: "Logout failed",
    });

    const result = await performLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: false, error: "Logout failed" });
  });
});
