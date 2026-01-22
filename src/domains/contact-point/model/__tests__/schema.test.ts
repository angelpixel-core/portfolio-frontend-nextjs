import {
  ContactPointSchema,
  ContactPointsSchema,
  type ContactPointModel,
} from "../schema";

describe("ContactPointSchema", () => {
  const validContactPoint = {
    id: 1,
    type: "social",
    provider: "github",
    label: "GitHub",
    href: "https://github.com/user",
    value: "https://github.com/user",
    icon: "GitHub",
  };

  it("validates a valid contact point object", () => {
    expect(() => ContactPointSchema.parse(validContactPoint)).not.toThrow();
  });

  it("returns typed contact point data", () => {
    const result: ContactPointModel =
      ContactPointSchema.parse(validContactPoint);
    expect(result.provider).toBe("github");
    expect(result.type).toBe("social");
  });

  it("validates type enum (social, communication, messaging)", () => {
    const social = { ...validContactPoint, type: "social" };
    const communication = { ...validContactPoint, type: "communication" };
    const messaging = { ...validContactPoint, type: "messaging" };

    expect(() => ContactPointSchema.parse(social)).not.toThrow();
    expect(() => ContactPointSchema.parse(communication)).not.toThrow();
    expect(() => ContactPointSchema.parse(messaging)).not.toThrow();
  });

  it("rejects invalid type enum", () => {
    const invalid = { ...validContactPoint, type: "invalid" };
    expect(() => ContactPointSchema.parse(invalid)).toThrow();
  });

  it("validates provider enum", () => {
    const providers = [
      "email",
      "linkedin",
      "github",
      "whatsapp",
      "twitter",
      "dribbble",
      "telegram",
    ];
    providers.forEach((provider) => {
      const contactPoint = { ...validContactPoint, provider };
      expect(() => ContactPointSchema.parse(contactPoint)).not.toThrow();
    });
  });

  it("rejects invalid provider enum", () => {
    const invalid = { ...validContactPoint, provider: "invalid" };
    expect(() => ContactPointSchema.parse(invalid)).toThrow();
  });

  it("validates required fields", () => {
    const invalidContactPoint = {
      id: 1,
      // missing required fields
    };
    expect(() => ContactPointSchema.parse(invalidContactPoint)).toThrow();
  });
});

describe("ContactPointsSchema", () => {
  it("validates an array of contact points", () => {
    const contactPoints = [
      {
        id: 1,
        type: "social",
        provider: "github",
        label: "GitHub",
        href: "https://github.com/user",
        value: "https://github.com/user",
        icon: "GitHub",
      },
      {
        id: 2,
        type: "social",
        provider: "linkedin",
        label: "LinkedIn",
        href: "https://linkedin.com/in/user",
        value: "https://linkedin.com/in/user",
        icon: "LinkedIn",
      },
    ];
    expect(() => ContactPointsSchema.parse(contactPoints)).not.toThrow();
  });

  it("rejects non-array input", () => {
    expect(() => ContactPointsSchema.parse({ id: 1 })).toThrow();
  });
});
