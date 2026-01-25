import type { JobExperience } from "./schema";

/**
 * Mock data for job experiences
 * Data sourced from docs/seeds/backend.rb (_customers array)
 * Ordered in reverse chronological order (newest first)
 */
const jobExperiencesMock: JobExperience[] = [
  {
    id: 1,
    position: "Independant",
    company: "Consulting Service",
    companyLink: "https://site.dev",
    time: "Feb 2023 - Dec 2023",
    address: "Remote",
    work: [
      {
        description:
          "I collaborated with Chief Technology Officers (CTOs), Product Owners, Project Managers and their teams to enhance their services platform.",
        tags: ["collaboration", "CTOs", "Product Owners", "Project Managers"],
      },
      {
        description:
          "The primary focus was on adding new features, planning deliveries, achieving new integrations, scaling solutions, improving security, defining task plans for developers, enhancing the overall end-user experience for web applications, and providing coaching for new team members.",
        tags: [
          "features",
          "deliveries",
          "integrations",
          "scaling",
          "security",
          "task plans",
          "coaching",
          "end-user experience",
        ],
      },
    ],
  },
  {
    id: 2,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    address: "New York, United States",
    work: [
      {
        description:
          "A significant part of my role involved code maintenance and enhancement.",
        tags: ["code maintenance", "enhancement"],
      },
      {
        description:
          "I diligently removed and refactored code, addressing technical debt, and implemented feature flags to ensure a more flexible and adaptable codebase.",
        tags: ["technical debt", "feature flags", "flexible", "adaptable"],
      },
      {
        description:
          "Additionally, I delved into database query optimization, enhancing overall system performance, and actively participated in bug fixing to uphold system reliability.",
        tags: [
          "database query optimization",
          "system performance",
          "bug fixing",
          "reliability",
        ],
      },
    ],
  },
  {
    id: 3,
    position: "Software Engineer L3",
    company: "SouthWorks",
    companyLink: "https://www.southworks.com",
    time: "May 2020 - Sept 2021",
    address: "Delaware, United States",
    work: [
      {
        description:
          "Incorporating leadership tasks, I took on a pivotal role in project management.",
        tags: ["leadership", "project management"],
      },
      {
        description:
          "This involved overseeing dashboards, assigning tasks, leading sprint planning sessions, and acting as a facilitator for delivering key milestones.",
        tags: ["dashboards", "sprint planning", "facilitator", "milestones"],
      },
      {
        description:
          "This multifaceted approach showcased not only technical acumen but also leadership and organizational skills in steering projects towards successful outcomes.",
        tags: [
          "technical acumen",
          "leadership",
          "organizational skills",
          "successful outcomes",
        ],
      },
    ],
  },
  {
    id: 4,
    position: "FullStack Engineer L2",
    company: "Nubi",
    companyLink: "https://www.tunubi.com",
    time: "Sept 2019 - May 2020",
    address: "Buenos Aires, Argentina",
    work: [
      {
        description:
          "I spearheaded impactful initiatives, showcasing a blend of technical expertise and strategic problem-solving.",
        tags: ["leadership", "problem-solving", "technical"],
      },
      {
        description:
          "I proposed and successfully implemented an auditory asynchronous service, optimizing the entire transaction remittance processing workflow.",
        tags: ["optimization", "workflow"],
      },
      {
        description:
          "This innovation not only improved efficiency but also enhanced the reliability of transaction auditing.",
        tags: ["efficiency", "reliability"],
      },
      {
        description:
          "Recognizing the importance of regulatory compliance, I undertook the redesign of fee calculations, aligning them with Argentina's tax regulations.",
        tags: ["regulatory compliance", "tax regulations"],
      },
    ],
  },
  {
    id: 5,
    position: "FullStack Developer",
    company: "Bitex",
    companyLink: "https://bitex.la",
    time: "Dec 2017 - May 2019",
    address: "Amsterdam, Netherlands",
    work: [
      {
        description:
          "I played a pivotal role in the financial technology sector, implementing strategic initiatives to enhance market operations and streamline asset management.",
        tags: [
          "financial technology",
          "strategic initiatives",
          "market operations",
          "asset management",
        ],
      },
      {
        description:
          "Throughout these endeavors, my role involved a deep understanding of financial markets, strategic thinking in implementing automated trading strategies, and the creation of tools to streamline API interactions for efficient asset management.",
        tags: [
          "financial markets",
          "automated trading strategies",
          "API interactions",
          "asset management",
        ],
      },
    ],
  },
  {
    id: 6,
    position: "Trainee",
    company: "UNLP",
    companyLink: "https://www.unlp.com.ar",
    time: "Sept 2014 - May 2015",
    address: "Buenos Aires, Argentina",
    work: [
      {
        description: "meran metasearch",
        tags: ["leadership", "problem-solving", "technical"],
      },
      {
        description: "libretas estudiantiles",
        tags: ["optimization", "workflow"],
      },
      {
        description: "recibos de sueldo",
        tags: ["efficiency", "reliability"],
      },
      {
        description: "ETL OAI",
        tags: ["regulatory compliance", "tax regulations"],
      },
    ],
  },
];

export default jobExperiencesMock;
