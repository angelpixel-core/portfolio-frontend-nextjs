import { permanentRedirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  permanentRedirect: jest.fn(),
}));

const mockPermanentRedirect = permanentRedirect as jest.MockedFunction<
  typeof permanentRedirect
>;

describe("ArticleRedirectPage", () => {
  beforeEach(() => {
    mockPermanentRedirect.mockReset();
  });

  it("redirects /article/[slug] to /articles/[slug]", async () => {
    const { default: ArticleRedirectPage } = await import("../page");

    await ArticleRedirectPage({
      params: Promise.resolve({ slug: "nuevo-art-url" }),
    });

    expect(mockPermanentRedirect).toHaveBeenCalledWith(
      "/articles/nuevo-art-url"
    );
  });
});
