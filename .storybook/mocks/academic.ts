/**
 * Storybook-only fake academic mock data (Lorem Ipsum)
 * Replaces real education data via NormalModuleReplacementPlugin
 */
import type { Academics } from "@/domains/academic/model/schema";

const academicsMock: Academics = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Engineering",
    institution: "Lorem University, Ipsum City",
    start_date: "March 2013",
    end_date: "Dec 2017",
    resume:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    degree: "Cloud Platform Certification",
    institution: "Placeholder Cloud Services",
    start_date: "Nov 2020",
    end_date: "Dec 2020",
    resume:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    verification_url: "https://example.com/verify/lorem-certification-12345",
  },
];

export default academicsMock;
