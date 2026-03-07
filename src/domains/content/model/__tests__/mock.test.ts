const ORIGINAL_ENV = process.env;

describe("Content mock source", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("uses env override in mock mode when provided", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "true";
    process.env.NEXT_PUBLIC_HOME_CONTENT = "runtime env value";

    const { default: contentsMock } = await import("../mock");
    expect(contentsMock[0].mainContent).toBe("runtime env value");
  });

  it("uses env override when mock mode is disabled", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    process.env.NEXT_PUBLIC_HOME_CONTENT = "runtime env value";

    const { default: contentsMock } = await import("../mock");
    expect(contentsMock[0].mainContent).toBe("runtime env value");
  });
});
