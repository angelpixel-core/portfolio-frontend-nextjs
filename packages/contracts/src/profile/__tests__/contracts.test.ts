import {
  ContactPointResponseSchema,
  CreateContactPointRequestSchema,
  ProfilePublicResponseSchema,
  ProfileSettingsResponseSchema,
  UpdateContactPointRequestSchema,
  UpdateProfileSettingsRequestSchema,
} from "..";

const settings = {
  id: 1,
  nickname: "owner",
  authorName: "Owner",
  authorRole: "Engineer",
  biography: ["Builds systems"],
  avatar: "/avatar.png",
  location: "Remote",
  email: "owner@example.com",
};

const contactPoint = {
  id: 1,
  type: "social" as const,
  provider: "github" as const,
  label: "GitHub",
  icon: "GitHub",
  identifier: "owner",
  href: "https://github.com/owner",
  value: "https://github.com/owner",
  visible: true,
  sortOrder: 0,
};

describe("profile contracts", () => {
  it("validates public profile responses and strips private contact fields", () => {
    const result = ProfilePublicResponseSchema.parse({
      ...settings,
      contactPoints: [{ ...contactPoint }],
    });

    expect(result.contactPoints[0]).not.toHaveProperty("identifier");
    expect(result.contactPoints[0]).not.toHaveProperty("visible");
  });

  it("validates settings and rejects empty updates", () => {
    expect(ProfileSettingsResponseSchema.parse(settings)).toEqual(settings);
    expect(
      UpdateProfileSettingsRequestSchema.parse({ email: "new@example.com" })
    ).toEqual({
      email: "new@example.com",
    });
    expect(() => UpdateProfileSettingsRequestSchema.parse({})).toThrow();
    expect(() =>
      ProfileSettingsResponseSchema.parse({ ...settings, email: "bad" })
    ).toThrow();
  });

  it("validates contact point requests and responses", () => {
    const { id: _id, ...createInput } = contactPoint;
    expect(CreateContactPointRequestSchema.parse(contactPoint)).toEqual(
      createInput
    );
    expect(ContactPointResponseSchema.parse(contactPoint)).toEqual(
      contactPoint
    );
    expect(
      UpdateContactPointRequestSchema.parse({ label: "New label" })
    ).toEqual({
      label: "New label",
    });
    expect(() => UpdateContactPointRequestSchema.parse({})).toThrow();
    expect(() =>
      CreateContactPointRequestSchema.parse({
        ...contactPoint,
        provider: "invalid",
      })
    ).toThrow();
  });
});
