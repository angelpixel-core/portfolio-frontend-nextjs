import { ProfileSchema, ProfilesSchema } from "../schema";
import type { ProfileModel } from "../schema";

describe("ProfileSchema", () => {
  const validProfile = {
    id: 1,
    nickname: "elvis",
    biography: [
      "Hi, I'm Angel Szymczak, a Full Stack Developer.",
      "With expertise in modern web technologies.",
    ],
    avatar: "@images/profile/hero.png",
    location: "La Plata, Argentina",
    email: "contact@amazingcompany.com",
    calendly: "https://www.calendly.com/contact@amazingcompany.com",
    telegram: "https://t.me/angelszymczak",
  };

  it("validates a valid profile object", () => {
    expect(() => ProfileSchema.parse(validProfile)).not.toThrow();
  });

  it("returns typed profile data", () => {
    const result: ProfileModel = ProfileSchema.parse(validProfile);
    expect(result.nickname).toBe("elvis");
    expect(result.biography).toHaveLength(2);
    expect(result.email).toBe("contact@amazingcompany.com");
  });

  it("validates required fields", () => {
    const invalidProfile = {
      id: 1,
      nickname: "test",
      // missing required fields
    };
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
  });

  it("validates email format", () => {
    const invalidEmail = {
      ...validProfile,
      email: "not-an-email",
    };
    expect(() => ProfileSchema.parse(invalidEmail)).toThrow();
  });

  it("validates optional URL fields", () => {
    const profileWithoutOptionals = {
      id: 1,
      nickname: "test",
      biography: ["Bio text"],
      avatar: "avatar.png",
      location: "Location",
      email: "test@example.com",
      // calendly and telegram are optional
    };
    expect(() => ProfileSchema.parse(profileWithoutOptionals)).not.toThrow();
  });

  it("rejects invalid URL for optional fields", () => {
    const invalidCalendly = {
      ...validProfile,
      calendly: "not-a-url",
    };
    expect(() => ProfileSchema.parse(invalidCalendly)).toThrow();
  });
});

describe("ProfilesSchema", () => {
  it("validates an array of profiles", () => {
    const profiles = [
      {
        id: 1,
        nickname: "user1",
        biography: ["Bio 1"],
        avatar: "avatar1.png",
        location: "Location 1",
        email: "user1@example.com",
      },
      {
        id: 2,
        nickname: "user2",
        biography: ["Bio 2"],
        avatar: "avatar2.png",
        location: "Location 2",
        email: "user2@example.com",
      },
    ];
    expect(() => ProfilesSchema.parse(profiles)).not.toThrow();
  });

  it("rejects non-array input", () => {
    expect(() => ProfilesSchema.parse({ id: 1 })).toThrow();
  });
});
