/**
 * Storybook-only fake job experience mock data (Lorem Ipsum)
 * Replaces real career history via NormalModuleReplacementPlugin
 */
import type { JobExperiences } from "@/domains/job-experience/model/schema";

const jobExperiencesMock: JobExperiences = [
  {
    id: 1,
    position: "Lead Frontend Engineer",
    company: "Acme Corp",
    companyLink: "https://example.com/acme",
    time: "Mar 2023 - Dec 2023",
    address: "Lorem City, Placeholder",
    work: [
      {
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
        tags: ["React", "TypeScript"],
      },
      {
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        tags: ["Node.js", "PostgreSQL"],
      },
    ],
  },
  {
    id: 2,
    position: "Senior FullStack Developer",
    company: "Lorem Industries",
    companyLink: "https://example.com/lorem-industries",
    time: "Feb 2022 - Feb 2023",
    address: "Ipsum Town, Dolor",
    work: [
      {
        description:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
        tags: ["Ruby", "Rails"],
      },
      {
        description:
          "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit.",
        tags: ["Docker", "AWS"],
      },
    ],
  },
  {
    id: 3,
    position: "Software Engineer",
    company: "Ipsum Technologies",
    companyLink: "https://example.com/ipsum-tech",
    time: "May 2020 - Sept 2021",
    address: "Dolor Valley, Amet",
    work: [
      {
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
        tags: ["JavaScript", "Next.js"],
      },
    ],
  },
  {
    id: 4,
    position: "Junior Developer",
    company: "Dolor Solutions",
    companyLink: "https://example.com/dolor-solutions",
    time: "Jan 2019 - Apr 2020",
    address: "Amet Springs, Consectetur",
    work: [
      {
        description:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
        tags: ["HTML", "CSS"],
      },
    ],
  },
  {
    id: 5,
    position: "Trainee",
    company: "Amet Dynamics",
    companyLink: "https://example.com/amet-dynamics",
    time: "Jun 2018 - Dec 2018",
    address: "Adipiscing, Elit",
    work: [
      {
        description:
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
        tags: ["Python", "SQL"],
      },
    ],
  },
];

export default jobExperiencesMock;
