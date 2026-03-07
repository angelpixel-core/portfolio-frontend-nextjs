export {};

const ORIGINAL_ENV = process.env;

describe("Profile mock source", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("uses NEXT_PUBLIC_ABOUT_CONTENT for biography when provided", async () => {
    process.env.NEXT_PUBLIC_ABOUT_CONTENT =
      "First paragraph\n\nSecond paragraph\nThird paragraph";

    const { default: profilesMock } = await import("../mock");
    expect(profilesMock[0].biography).toEqual([
      "First paragraph",
      "Second paragraph",
      "Third paragraph",
    ]);
  });

  it("splits biography by sentence when content is a single line", async () => {
    process.env.NEXT_PUBLIC_ABOUT_CONTENT =
      "First sentence. Second sentence. Third sentence.";

    const { default: profilesMock } = await import("../mock");
    expect(profilesMock[0].biography).toEqual([
      "First sentence.",
      "Second sentence.",
      "Third sentence.",
    ]);
  });

  it("uses default biography when NEXT_PUBLIC_ABOUT_CONTENT is empty", async () => {
    process.env.NEXT_PUBLIC_ABOUT_CONTENT = "";

    const { default: profilesMock } = await import("../mock");
    expect(profilesMock[0].biography).toHaveLength(3);
  });
});
