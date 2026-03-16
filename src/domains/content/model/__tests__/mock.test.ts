import contentsMock from "../mock";
import { ContentsSchema } from "../schema";

describe("Content mock fixtures", () => {
  it("exposes static mock data for tests", () => {
    const parsed = ContentsSchema.parse(contentsMock);
    expect(parsed).toHaveLength(contentsMock.length);
    expect(parsed[0]?.slug).toBe("landing");
  });
});
