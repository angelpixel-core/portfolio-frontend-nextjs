import type { JobExperience } from "./schema";

/**
 * Mock data for job experiences
 * Data sourced from docs/seeds/backend.rb (_customers array)
 * Ordered in reverse chronological order (newest first)
 */
const jobExperiencesMock: JobExperience[] = [
  {
    id: 1,
    position: "Independent Consultant",
    company: "Independent Consulting",
    companyLink: "https://site.dev",
    time: "Feb 2023 - Dec 2023",
    year: "2023",
    address: "Remote",
    contextBadges: ["Consulting", "Remote", "B2B Delivery"],
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    group: "platform",
    work: [
      {
        description:
          "Partnered with CTOs, product owners, and delivery leads to improve platform direction and execution.",
        tags: ["collaboration", "CTOs", "Product Owners", "Project Managers"],
      },
      {
        description:
          "Delivered new features and integrations while improving scalability, security, and developer planning workflows.",
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
      {
        description:
          "Coached newer engineers and helped teams prioritize changes that improved web application user experience.",
        tags: ["coaching", "end-user experience"],
      },
    ],
  },
  {
    id: 2,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    year: "2022",
    address: "New York, United States",
    contextBadges: ["PropTech", "Product Engineering", "Scale"],
    technologies: ["TypeScript", "React", "Ruby on Rails", "GraphQL"],
    group: "engineering",
    work: [
      {
        description:
          "Maintained and modernized core product areas to keep delivery speed high while reducing regressions.",
        tags: ["code maintenance", "enhancement"],
      },
      {
        description:
          "Refactored legacy code, paid down technical debt, and introduced feature flags for safer rollouts.",
        tags: ["technical debt", "feature flags", "flexible", "adaptable"],
      },
      {
        description:
          "Optimized database queries and resolved production bugs to improve performance and reliability.",
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
    year: "2021",
    address: "Delaware, United States",
    contextBadges: ["Agile Delivery", "Client Services", "Leadership"],
    technologies: ["React", "Node.js", "Jest", "Docker"],
    group: "engineering",
    work: [
      {
        description:
          "Owned project coordination across dashboards, priorities, and day-to-day team execution.",
        tags: ["leadership", "project management"],
      },
      {
        description:
          "Led sprint planning and task assignment to keep milestones predictable and delivery aligned.",
        tags: ["dashboards", "sprint planning", "facilitator", "milestones"],
      },
      {
        description:
          "Combined technical delivery with leadership to move complex projects to successful outcomes.",
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
    year: "2020",
    address: "Buenos Aires, Argentina",
    contextBadges: ["FinTech", "Compliance", "Payments"],
    technologies: ["Node.js", "PostgreSQL", "Redis", "RabbitMQ"],
    group: "platform",
    work: [
      {
        description:
          "Led strategic initiatives that improved transaction-platform reliability and operational decision-making.",
        tags: ["leadership", "problem-solving", "technical"],
      },
      {
        description:
          "Designed and launched an asynchronous auditing service that streamlined remittance processing.",
        tags: ["optimization", "workflow"],
      },
      {
        description:
          "Redesigned fee calculations to align with Argentina tax rules and strengthen compliance confidence.",
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
    year: "2019",
    address: "Amsterdam, Netherlands",
    contextBadges: ["Crypto", "Trading", "Market Operations"],
    technologies: ["Ruby", "JavaScript", "REST APIs", "MySQL"],
    group: "engineering",
    work: [
      {
        description:
          "Built fintech capabilities that improved market operations and day-to-day asset management workflows.",
        tags: [
          "financial technology",
          "strategic initiatives",
          "market operations",
          "asset management",
        ],
      },
      {
        description:
          "Implemented automated trading strategies informed by market behavior and business priorities.",
        tags: [
          "financial markets",
          "automated trading strategies",
          "API interactions",
          "asset management",
        ],
      },
      {
        description:
          "Created internal API tooling that reduced operational friction and accelerated portfolio actions.",
        tags: ["API interactions", "asset management"],
      },
    ],
  },
  {
    id: 6,
    position: "Trainee",
    company: "UNLP",
    companyLink: "https://www.unlp.com.ar",
    time: "Sept 2014 - May 2015",
    year: "2015",
    address: "Buenos Aires, Argentina",
    contextBadges: ["Education", "Research", "Data Processing"],
    technologies: ["PHP", "MySQL", "ETL", "Linux"],
    group: "engineering",
    work: [
      {
        description:
          "Delivered Meran metasearch improvements to increase result relevance and search usability.",
        tags: ["leadership", "problem-solving", "technical"],
      },
      {
        description:
          "Built student-record modules (libretas estudiantiles) to improve academic data access.",
        tags: ["optimization", "workflow"],
      },
      {
        description:
          "Implemented payroll receipts and OAI ETL processes to support operational reporting pipelines.",
        tags: ["efficiency", "reliability"],
      },
    ],
  },
];

export default jobExperiencesMock;
