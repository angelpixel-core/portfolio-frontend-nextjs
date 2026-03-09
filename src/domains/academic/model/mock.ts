import type { Academics } from "./schema";

/**
 * Mock data for academic credentials
 * Story 3.3: Academic Background
 * Story 3.4: Added verification_url and type fields
 */
const academicsMock: Academics = [
  {
    id: 1,
    degree: "B.Sc. in Information Systems",
    institution: "National University of La Plata",
    start_date: "2013",
    end_date: "2017",
  },
  {
    id: 2,
    degree: "AWS Certified Cloud Practitioner",
    institution: "Amazon Web Services",
    start_date: "2020",
    end_date: "2020",
    verification_url: "https://www.credly.com/badges/aws-cloud-practitioner",
  },
];

export default academicsMock;
