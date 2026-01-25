import type { Academics } from "./schema";

/**
 * Mock data for academic credentials
 * Story 3.3: Academic Background
 */
const academicsMock: Academics = [
  {
    id: 1,
    degree: "Bachelor Of Science in Information Systems",
    institution: "La Plata, Argentina (MIT)",
    start_date: "March 2013",
    end_date: "Dec 2017",
    resume:
      "The program equips individuals to lead software projects and develop information systems.",
  },
  {
    id: 2,
    degree: "Cloud Platform Practitioner",
    institution: "Amazon Web Services",
    start_date: "Nov 2020",
    end_date: "Dec 2020",
    resume:
      "Certification covering AWS cloud principles, management, and architectural practices.",
  },
];

export default academicsMock;
