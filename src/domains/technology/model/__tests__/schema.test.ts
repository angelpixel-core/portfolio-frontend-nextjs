import { TechnologySchema, TechnologiesSchema } from "../schema";
import type { TechnologyModel } from "../schema";

describe("TechnologySchema", () => {
  const validTechnology = {
    id: 1,
    name: "React",
    status: "active",
    x: "14vw",
    y: "0vw",
  };

  it("validates a valid technology object", () => {
    expect(() => TechnologySchema.parse(validTechnology)).not.toThrow();
  });

  it("returns typed technology data", () => {
    const result: TechnologyModel = TechnologySchema.parse(validTechnology);
    expect(result.name).toBe("React");
    expect(result.status).toBe("active");
  });

  it("validates required fields", () => {
    const invalidTechnology = {
      id: 1,
      // missing required fields
    };
    expect(() => TechnologySchema.parse(invalidTechnology)).toThrow();
  });

  it("allows optional proficiency field", () => {
    const techWithProficiency = {
      ...validTechnology,
      proficiency: "expert",
    };
    expect(() => TechnologySchema.parse(techWithProficiency)).not.toThrow();
  });
});

describe("TechnologiesSchema", () => {
  it("validates an array of technologies", () => {
    const technologies = [
      { id: 1, name: "Ruby", status: "active", x: "8vw", y: "0vw" },
      { id: 2, name: "Rails", status: "active", x: "6vw", y: "5vw" },
    ];
    expect(() => TechnologiesSchema.parse(technologies)).not.toThrow();
  });

  it("rejects non-array input", () => {
    expect(() => TechnologiesSchema.parse({ id: 1 })).toThrow();
  });
});
