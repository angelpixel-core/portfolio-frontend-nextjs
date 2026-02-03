/**
 * Word Cloud Concepts Data
 *
 * Professional concepts for the About page word cloud.
 * Weight determines visual size (1-5 scale).
 */

export const CONCEPTS = [
  {
    id: "systems-design",
    label: "Systems Design",
    weight: 5,
    description:
      "Architecting scalable, maintainable systems with clear boundaries and contracts",
    relatedKeywords: [
      "Architecture",
      "Microservices",
      "Event-Driven",
      "Domain-Driven Design",
      "API Design",
    ],
    technologies: [
      { name: "GraphQL", icon: "GraphQLIcon" },
      { name: "Kafka", icon: "KafkaIcon" },
      { name: "Redis", icon: "RedisIcon" },
      { name: "Docker", icon: "DockerIcon" },
    ],
    companies: ["Mercado Libre", "Despegar", "Globant"],
  },
  {
    id: "backend-engineering",
    label: "Backend Engineering",
    weight: 5,
    description:
      "Building robust server-side applications with focus on performance and reliability",
    relatedKeywords: [
      "Node.js",
      "Python",
      "Go",
      "PostgreSQL",
      "Redis",
      "GraphQL",
      "REST",
    ],
    technologies: [
      { name: "Node.js", icon: "NodeIcon" },
      { name: "Ruby", icon: "RubyIcon" },
      { name: "Rails", icon: "RailsIcon" },
      { name: "PostgreSQL", icon: "PostgresIcon" },
      { name: "Redis", icon: "RedisIcon" },
    ],
    companies: ["Mercado Libre", "Kavak", "Auth0"],
  },
  {
    id: "frontend-architecture",
    label: "Frontend Architecture",
    weight: 4,
    description:
      "Designing component systems and state management for complex UIs",
    relatedKeywords: [
      "React",
      "Next.js",
      "TypeScript",
      "Design Systems",
      "Accessibility",
    ],
    technologies: [
      { name: "React", icon: "ReactIcon" },
      { name: "Next.js", icon: "NextIcon" },
      { name: "TypeScript", icon: "TypeScriptIcon" },
      { name: "Redux", icon: "ReduxIcon" },
      { name: "Tailwind", icon: "TailwindIcon" },
    ],
    companies: ["Globant", "Kavak", "Despegar"],
  },
  {
    id: "cloud-engineering",
    label: "Cloud Engineering",
    weight: 4,
    description:
      "Deploying and managing infrastructure with modern cloud practices",
    relatedKeywords: [
      "AWS",
      "GCP",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Docker",
    ],
    technologies: [
      { name: "AWS", icon: "AWSIcon" },
      { name: "Docker", icon: "DockerIcon" },
      { name: "Terraform", icon: "TerraformIcon" },
      { name: "Jenkins", icon: "JenkinsIcon" },
    ],
    companies: ["Mercado Libre", "Auth0", "Globant"],
  },
  {
    id: "security-reliability",
    label: "Security & Reliability",
    weight: 3,
    description:
      "Implementing secure systems with high availability and fault tolerance",
    relatedKeywords: [
      "OAuth",
      "Zero Trust",
      "Monitoring",
      "Observability",
      "SRE",
    ],
    technologies: [
      { name: "Linux", icon: "LinuxIcon" },
      { name: "Docker", icon: "DockerIcon" },
      { name: "AWS", icon: "AWSIcon" },
    ],
    companies: ["Auth0", "Mercado Libre"],
  },
  {
    id: "product-ux",
    label: "Product & UX Thinking",
    weight: 3,
    description:
      "Bridging technical decisions with user needs and business outcomes",
    relatedKeywords: [
      "User Research",
      "Prototyping",
      "A/B Testing",
      "Analytics",
      "Figma",
    ],
    technologies: [
      { name: "Figma", icon: "FigmaIcon" },
      { name: "Storybook", icon: "StorybookIcon" },
      { name: "React", icon: "ReactIcon" },
    ],
    companies: ["Kavak", "Globant", "Despegar"],
  },
  {
    id: "data-engineering",
    label: "Data Engineering",
    weight: 3,
    description:
      "Building pipelines and systems for data processing and analytics",
    relatedKeywords: ["ETL", "Data Modeling", "SQL", "Streaming", "Analytics"],
    technologies: [
      { name: "PostgreSQL", icon: "PostgresIcon" },
      { name: "Kafka", icon: "KafkaIcon" },
      { name: "Redis", icon: "RedisIcon" },
      { name: "MongoDB", icon: "MongoIcon" },
    ],
    companies: ["Mercado Libre", "Despegar"],
  },
  {
    id: "developer-experience",
    label: "Developer Experience",
    weight: 2,
    description: "Creating tools and workflows that improve team productivity",
    relatedKeywords: [
      "Tooling",
      "Documentation",
      "Testing",
      "Code Review",
      "Automation",
    ],
    technologies: [
      { name: "Git", icon: "GitIcon" },
      { name: "Jenkins", icon: "JenkinsIcon" },
      { name: "Storybook", icon: "StorybookIcon" },
      { name: "Cucumber", icon: "CucumberIcon" },
    ],
    companies: ["Globant", "Kavak", "Auth0"],
  },
];

/**
 * Icon component mapping for dynamic rendering
 */
export { default as AWSIcon } from "@/atoms/icons/AWSIcon";
export { default as DockerIcon } from "@/atoms/icons/DockerIcon";
export { default as GraphQLIcon } from "@/atoms/icons/GraphQLIcon";
export { default as KafkaIcon } from "@/atoms/icons/KafkaIcon";
export { default as RedisIcon } from "@/atoms/icons/RedisIcon";
export { default as NodeIcon } from "@/atoms/icons/NodeIcon";
export { default as RubyIcon } from "@/atoms/icons/RubyIcon";
export { default as RailsIcon } from "@/atoms/icons/RailsIcon";
export { default as PostgresIcon } from "@/atoms/icons/PostgresIcon";
export { default as ReactIcon } from "@/atoms/icons/ReactIcon";
export { default as NextIcon } from "@/atoms/icons/NextIcon";
export { default as TypeScriptIcon } from "@/atoms/icons/TypeScriptIcon";
export { default as ReduxIcon } from "@/atoms/icons/ReduxIcon";
export { default as TailwindIcon } from "@/atoms/icons/TailwindIcon";
export { default as TerraformIcon } from "@/atoms/icons/TerraformIcon";
export { default as JenkinsIcon } from "@/atoms/icons/JenkinsIcon";
export { default as LinuxIcon } from "@/atoms/icons/LinuxIcon";
export { default as FigmaIcon } from "@/atoms/icons/FigmaIcon";
export { default as StorybookIcon } from "@/atoms/icons/StorybookIcon";
export { default as MongoIcon } from "@/atoms/icons/MongoIcon";
export { default as GitIcon } from "@/atoms/icons/GitIcon";
export { default as CucumberIcon } from "@/atoms/icons/CucumberIcon";

/**
 * Get font size class based on weight (1-5)
 * Returns Tailwind classes for responsive sizing
 */
export const getWeightClass = (weight) => {
  const sizeMap = {
    5: "word-cloud__word--xl",
    4: "word-cloud__word--lg",
    3: "word-cloud__word--md",
    2: "word-cloud__word--sm",
    1: "word-cloud__word--xs",
  };
  return sizeMap[weight] || sizeMap[3];
};

/**
 * Icon component map for dynamic rendering
 */
export const ICON_MAP = {
  AWSIcon: "AWSIcon",
  DockerIcon: "DockerIcon",
  GraphQLIcon: "GraphQLIcon",
  KafkaIcon: "KafkaIcon",
  RedisIcon: "RedisIcon",
  NodeIcon: "NodeIcon",
  RubyIcon: "RubyIcon",
  RailsIcon: "RailsIcon",
  PostgresIcon: "PostgresIcon",
  ReactIcon: "ReactIcon",
  NextIcon: "NextIcon",
  TypeScriptIcon: "TypeScriptIcon",
  ReduxIcon: "ReduxIcon",
  TailwindIcon: "TailwindIcon",
  TerraformIcon: "TerraformIcon",
  JenkinsIcon: "JenkinsIcon",
  LinuxIcon: "LinuxIcon",
  FigmaIcon: "FigmaIcon",
  StorybookIcon: "StorybookIcon",
  MongoIcon: "MongoIcon",
  GitIcon: "GitIcon",
  CucumberIcon: "CucumberIcon",
};
