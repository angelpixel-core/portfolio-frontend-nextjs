const academics = [
  {
    email: "angel.szymczak@hotmail.com",
    type: " Bachelor Of Science in Information Systems",
    time: "March 2013, Dec 2017",
    place: "La Plata, Argentina (MIT)",
    info: "The program equips individuals to lead software projects, oversee thematic areas within organizations, guide the analysis of functional processes, and develop information systems. It encompasses planning technical-economic studies, defining metrics for software quality and security, conducting computer systems audits, and managing resource-focused projects. Graduates are prepared to teach computer science, engage in research within software and information systems, and lead research initiatives in the field.",
  },
  {
    email: "angel.szymczak@hotmail.com",
    type: "Cloud Platform Practitioner",
    time: "Nov 2020",
    place: "Amazon Web Services",
    info: "The AWS Certified Cloud Practitioner certification equips professionals with comprehensive cloud skills, ranging from the selection and management of services to the application of architectural principles and security practices. These skills are essential for building a solid foundation and advancing into more specialized roles within the AWS ecosystem.",
  },
  {
    email: "angel.szymczak@hotmail.com",
    type: "Online Backend Specialization",
    time: "+100 hours",
    place: "Self-Taught Online Education",
    info: [
      {
        topic: "Programming Languages",
        technologies: ["Bash", "Ruby", "JavaScript"],
        knowledge: [
          {
            paradigm: "Object Oriented Programming",
            fundamentals: ["Encapsulation", "Inheritance", "Polymorphism"],
          },
          {
            paradigm: "Functional Programming",
            fundamentals: ["Higher Order Functions", "Immutability"],
          },
          {
            paradigm: "Reactive Programming",
            fundamentals: ["Asynchronous Events Management", "ReactiveX"],
          },
          {
            paradigm: "Design Patterns",
            fundamentals: [
              "Singleton",
              "Factory",
              "Observer",
              "MVC",
              "ORM",
              "Facade",
            ],
          },
          {
            paradigm: "SOLID Principles",
            fundamentals: [
              "Single Responsibility",
              "Open-Closed",
              "Liskov Substitution",
              "Interface Segregation",
              "Dependency Inversion",
            ],
          },
          {
            paradigm: "Test Driven Development",
            fundamentals: [
              "TDD",
              "RSpec",
              "Unit Test",
              "Integration Test",
              "Acceptance Test",
            ],
          },
          {
            paradigm: "Behaviour Driven Development",
            fundamentals: ["Gherkins", "Cucumber", "Capybara"],
          },
          {
            paradigm: "Domain Driven Development",
            fundamentals: ["CQRS", "Ports & Adapters"],
          },
          {
            paradigm: "Fundamentals",
            fundamentals: ["SOLID", "DRY", "KISS", "YAGNO"],
          },
        ],
      },
      {
        topic: "Frameworks",
        technologies: ["Ruby on Rails", "Nextjs", "Nodejs"],
        knowledge: [],
      },
      {
        topic: "Databases",
        technologies: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
        knowledge: [],
      },
      {
        topic: "Event Streamming",
        technologies: ["Kafka"],
        knowledge: [{ paradigm: "", fundamentals: ["WebHooks"] }],
      },
      {
        topic: "Software Architect",
        technologies: [],
        knowledge: [
          {
            paradigm: "Maintainability",
            fundamentals: ["Monolithic", "Microservices", "Serverless"],
          },
        ],
      },
      {
        topic: "User Centered Design",
        technologies: ["Postman", "Apollo"],
        knowledge: [
          {
            paradigm: "Component and System Design",
            fundamentals: ["API", "Web Services", "3rd Party Integration"],
          },
        ],
      },
      {
        topic: "Security",
        technologies: ["Rake Attack", "Brakerman", "Snyk"],
        knowledge: [
          {
            paradigm: "Secure Web App Developement",
            fundamentals: ["OWASP"],
          },
        ],
      },
      {
        topic: "Automation",
        technologies: ["Capistrano", "GitHub Actions", "Docker", "Jenkins"],
        knowledge: [
          {
            paradigm: "Cloud Computing",
            fundamentals: ["CI/CD", "Heroku", "AWS"],
          },
        ],
      },
      {
        topic: "Versioning Management",
        technologies: ["Git"],
        knowledge: [],
      },
      {
        topic: "Documentation",
        technologies: ["Swagger"],
        knowledge: [],
      },
    ],
  },
  {
    email: "angel.szymczak@hotmail.com",
    type: "Online Frontend Specialization",
    time: "+100 hours",
    place: "Self-Taught Online Education",
    info: [
      {
        topic: "Programming Languages",
        technologies: ["HTML", "CSS", "JavaScript", "TypeScript"],
        knowledge: [],
      },
      {
        topic: "Web Design",
        technologies: ["Media Query", "Flexbox", "Grid", "Figma", "Storybook"],
        knowledge: [
          {
            paradigm: "",
            fundamentals: [
              "Responsive Design",
              "Atomic Design",
              "Dark Theme",
              "CSR",
              "SSR",
            ],
          },
        ],
      },
      {
        topic: "Frameworks",
        technologies: [
          "SASS",
          "TailwindCSS",
          "Turbo",
          "HOTwire",
          "Stimulus",
          "React",
          "Svelte",
        ],
        knowledge: [],
      },
      {
        topic: "Web App Architect",
        technologies: [
          "Flux",
          "Redux",
          "Web Components",
          "Single Page Application",
          "Service Workers",
          "Web Sockets",
          "Parallax",
        ],
        knowledge: [],
      },
      {
        topic: "Web Accessibility",
        technologies: ["WCAG"],
        knowledge: [],
      },
      {
        topic: "Performance Optimization",
        technologies: [],
        knowledge: [
          {
            paradigm: "Lighthouse",
            fundamentals: [
              "Lazy Loading of Resources",
              "Image Compression",
              "Code Optimization",
            ],
          },
        ],
      },
      {
        topic: "Interactivity and Animation",
        technologies: ["GSAP", "Framer Motion", "CSS Animations"],
        knowledge: [],
      },
      {
        topic: "Testing Frontend",
        technologies: ["Jest"],
        knowledge: [],
      },
      {
        topic: "State Management",
        technologies: [],
        knowledge: [{ paradigm: "", fundamentals: ["Contexts", "Hooks"] }],
      },
      {
        topic: "Data Exchange Format",
        technologies: ["JSON", "GraphQL"],
        knowledge: [],
      },
      {
        topic: "Security",
        technologies: [],
        knowledge: [
          { paradigm: "Good Practices", fundamentals: ["XSS", "CSRF"] },
        ],
      },
    ],
  },
];

async function all() {
  return academics;
}

async function fetchBy({ email }) {
  return academics.filter((academic) => academic.email === email);
}

export const Academic = {
  all,
  fetchBy,
};
