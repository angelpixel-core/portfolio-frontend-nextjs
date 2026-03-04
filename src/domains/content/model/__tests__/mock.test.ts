const ORIGINAL_ENV = process.env;

const DEFAULT_HOME_CONTENT =
  "As a skilled Full-Stack developer, I am dedicated to turning ideas into Scalable Web Solutions. Explore my latest projects and articles, showcasing my expertise on.";

describe("Content mock source", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("uses default content in mock mode even when env override exists", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "true";
    process.env.NEXT_PUBLIC_HOME_CONTENT = "stale env value";

    const { default: contentsMock } = await import("../mock");
    expect(contentsMock[0].mainContent).toBe(DEFAULT_HOME_CONTENT);
  });

  it("uses env override when mock mode is disabled", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    process.env.NEXT_PUBLIC_HOME_CONTENT = "runtime env value";

    const { default: contentsMock } = await import("../mock");
    expect(contentsMock[0].mainContent).toBe("runtime env value");
  });
});
