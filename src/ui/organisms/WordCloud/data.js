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
  },
  {
    id: "data-engineering",
    label: "Data Engineering",
    weight: 3,
    description: "Building pipelines and systems for data processing and analytics",
    relatedKeywords: [
      "ETL",
      "Data Modeling",
      "SQL",
      "Streaming",
      "Analytics",
    ],
  },
  {
    id: "developer-experience",
    label: "Developer Experience",
    weight: 2,
    description:
      "Creating tools and workflows that improve team productivity",
    relatedKeywords: [
      "Tooling",
      "Documentation",
      "Testing",
      "Code Review",
      "Automation",
    ],
  },
];

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
