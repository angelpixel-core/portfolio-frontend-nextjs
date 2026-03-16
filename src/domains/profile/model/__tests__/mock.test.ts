import profilesMock from "../mock";
import { ProfilesSchema } from "../schema";

describe("Profile mock fixtures", () => {
  it("exposes static mock data for tests", () => {
    const parsed = ProfilesSchema.parse(profilesMock);
    expect(parsed).toHaveLength(profilesMock.length);
    expect(parsed[0]?.nickname).toBe("portfolio-owner");
  });
});
