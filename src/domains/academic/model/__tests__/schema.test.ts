/**
 * Academic Schema Tests
 * Story 3.3: Academic Background
 */

import { AcademicSchema, AcademicsSchema } from "../schema";
import type { Academic } from "../schema";
import academicsMock from "../mock";

describe("AcademicSchema", () => {
  describe("valid academic entries", () => {
    it("parses a valid academic entry with all fields", () => {
      const validAcademic: Academic = {
        id: 1,
        degree: "Bachelor Of Science in Information Systems",
        institution: "La Plata, Argentina (MIT)",
        start_date: "March 2013",
        end_date: "Dec 2017",
        resume:
          "The program equips individuals to lead software projects and develop information systems.",
      };

      const result = AcademicSchema.safeParse(validAcademic);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validAcademic);
      }
    });

    it("parses academic entry without optional resume field", () => {
      const academicWithoutResume = {
        id: 2,
        degree: "Cloud Platform Practitioner",
        institution: "Amazon Web Services",
        start_date: "Nov 2020",
        end_date: "Dec 2020",
      };

      const result = AcademicSchema.safeParse(academicWithoutResume);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.resume).toBeUndefined();
      }
    });
  });

  describe("invalid academic entries", () => {
    it("fails when id is a string instead of number", () => {
      const invalidAcademic = {
        id: "1", // Should be number
        degree: "Bachelor Of Science",
        institution: "University",
        start_date: "2013",
        end_date: "2017",
      };

      const result = AcademicSchema.safeParse(invalidAcademic);
      expect(result.success).toBe(false);
    });

    it("fails when required degree field is missing", () => {
      const missingDegree = {
        id: 1,
        institution: "University",
        start_date: "2013",
        end_date: "2017",
      };

      const result = AcademicSchema.safeParse(missingDegree);
      expect(result.success).toBe(false);
    });

    it("fails when required institution field is missing", () => {
      const missingInstitution = {
        id: 1,
        degree: "Bachelor",
        start_date: "2013",
        end_date: "2017",
      };

      const result = AcademicSchema.safeParse(missingInstitution);
      expect(result.success).toBe(false);
    });

    it("fails when required start_date field is missing", () => {
      const missingStartDate = {
        id: 1,
        degree: "Bachelor",
        institution: "University",
        end_date: "2017",
      };

      const result = AcademicSchema.safeParse(missingStartDate);
      expect(result.success).toBe(false);
    });

    it("fails when required end_date field is missing", () => {
      const missingEndDate = {
        id: 1,
        degree: "Bachelor",
        institution: "University",
        start_date: "2013",
      };

      const result = AcademicSchema.safeParse(missingEndDate);
      expect(result.success).toBe(false);
    });
  });
});

describe("AcademicsSchema (array)", () => {
  it("validates an array of academic entries", () => {
    const academics = [
      {
        id: 1,
        degree: "Bachelor Of Science in Information Systems",
        institution: "La Plata, Argentina (MIT)",
        start_date: "March 2013",
        end_date: "Dec 2017",
        resume: "Program description",
      },
      {
        id: 2,
        degree: "Cloud Platform Practitioner",
        institution: "Amazon Web Services",
        start_date: "Nov 2020",
        end_date: "Dec 2020",
      },
    ];

    const result = AcademicsSchema.safeParse(academics);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
    }
  });

  it("validates an empty array", () => {
    const result = AcademicsSchema.safeParse([]);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
  });

  it("fails when array contains invalid entry", () => {
    const invalidArray = [
      {
        id: 1,
        degree: "Valid",
        institution: "University",
        start_date: "2013",
        end_date: "2017",
      },
      {
        id: "invalid", // Invalid id type
        degree: "Invalid",
        institution: "University",
        start_date: "2013",
        end_date: "2017",
      },
    ];

    const result = AcademicsSchema.safeParse(invalidArray);
    expect(result.success).toBe(false);
  });
});

describe("Mock data validation", () => {
  it("validates mock data against AcademicsSchema", () => {
    const result = AcademicsSchema.safeParse(academicsMock);
    expect(result.success).toBe(true);
  });

  it("mock data contains expected entries", () => {
    expect(academicsMock).toHaveLength(2);
    expect(academicsMock[0].degree).toBe(
      "Bachelor Of Science in Information Systems"
    );
    expect(academicsMock[1].degree).toBe("Cloud Platform Practitioner");
  });
});
