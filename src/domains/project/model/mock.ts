import type { ProjectModel } from "./schema";

/**
 * Project Mock Data
 *
 * This is the CANONICAL source for project data in the portfolio.
 * To add or update projects, modify this file directly.
 *
 * Each project MUST conform to the ProjectSchema defined in ./schema.ts
 * The data is validated at runtime using Zod.
 *
 * @see ./schema.ts for field definitions and validation rules
 * @see docs/content-management.md for step-by-step instructions
 */
const projectsMock: ProjectModel[] = [
  {
    id: 1,
    slug: "crypto-screener",
    title: "Crypto Screener Application",
    summary:
      "A feature-rich Crypto Screener App using React, Tailwind CSS, Context API and React Router.",
    description:
      "This comprehensive cryptocurrency screening application provides real-time market data analysis, portfolio tracking, and advanced filtering capabilities. Built with a modern React architecture, it features responsive design with Tailwind CSS and efficient state management using Context API. Users can track multiple cryptocurrencies, set price alerts, and analyze market trends through an intuitive dashboard interface.",
    technologies: [
      "React",
      "Tailwind CSS",
      "Context API",
      "React Router",
      "JavaScript",
    ],
    outcomes:
      "Achieved 50% faster load times compared to similar apps through optimized data fetching and caching strategies.",
    demo: "https://crypto-screener-demo.com",
    repository: "https://github.com/AngelThunder/crypto-screener",
    img: "/images/projects/crypto-screener-cover-image.jpg",
    screenshots: ["/images/projects/crypto-screener-cover-image.jpg"],
    tags: "Back Office • JavaScript • React",
    featured: true,
  },
  {
    id: 2,
    slug: "portfolio-website",
    title: "Portfolio Website",
    summary:
      "A professional portfolio website using NextJS, Framer-motion, and Styled-components.",
    description:
      "A modern, performant portfolio website showcasing professional work and skills. Built with Next.js for optimal SEO and performance, featuring smooth animations with Framer Motion and styled with a custom design system. The site includes dark/light theme support, responsive layouts, and accessibility-first design principles.",
    technologies: [
      "Next.js",
      "Framer Motion",
      "Styled Components",
      "TypeScript",
      "Vercel",
    ],
    outcomes:
      "Lighthouse score of 95+ across all metrics with perfect accessibility rating.",
    demo: "https://portfolio-demo.com",
    repository: "https://github.com/AngelThunder/portfolio",
    img: "/images/projects/portfolio-cover-image.jpg",
    tags: "Web Site • JavaScript • NextJS",
    featured: false,
  },
  {
    id: 3,
    slug: "devdreaming-blog",
    title: "DevDreaming Blog",
    summary:
      "A modern blog platform for developers featuring articles, tutorials and tech insights.",
    description:
      "A full-featured blog platform designed specifically for developers, featuring MDX support for interactive code examples, syntax highlighting, and a clean reading experience. Includes features like article search, category filtering, reading time estimates, and social sharing capabilities. Built with SEO best practices for maximum content discoverability.",
    technologies: ["Next.js", "MDX", "Tailwind CSS", "Prisma", "PostgreSQL"],
    demo: "https://devdreaming-demo.com",
    repository: "https://github.com/AngelThunder/devdreaming",
    img: "/images/projects/devdreaming.jpg",
    tags: "Blog • JavaScript • NextJS",
    featured: false,
  },
  {
    id: 4,
    slug: "nft-collection-marketplace",
    title: "NFT Collection Marketplace",
    summary:
      "A Web3 exchange platform focused on mint, listing, and settlement flows for curated NFT collections.",
    description:
      "Designed as a transaction-driven system for digital asset commerce, this marketplace coordinates wallet auth, collection indexing, and smart-contract settlement in one operator-friendly flow. The platform combines Ethereum contracts with analytics and floor tracking so users can evaluate collection health before executing minting or trading decisions.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Solidity",
      "Tailwind CSS",
    ],
    outcomes:
      "Processed over 2 000 test transactions on Goerli testnet with zero failed mints.",
    demo: "https://nft-marketplace-demo.com",
    repository: "https://github.com/AngelThunder/nft-marketplace",
    img: "/images/projects/nft-collection-website-cover-image.jpg",
    tags: "Marketplace Systems • Web3 • Ethereum",
    featured: true,
    featuredCard: {
      contextBadges: [
        "Web3 Commerce",
        "Settlement Architecture",
        "Collection Analytics",
      ],
      focusLine:
        "Focus: align wallet onboarding, contract execution, and market observability in one flow.",
      architecture: {
        image: "/images/projects/nft-collection-architecture.jpg",
        alt: "Architecture diagram of NFT marketplace platform",
        caption:
          "Wallet gateway, marketplace API, and smart-contract settlement pipeline.",
      },
    },
  },
  {
    id: 5,
    slug: "agency-website",
    title: "Agency Website",
    summary:
      "A high-performance agency landing page with scroll-driven animations and CMS-powered content.",
    description:
      "A sleek marketing website for a digital agency, built with Next.js for static generation and Framer Motion for scroll-triggered animations. Content is managed through a headless CMS, enabling the marketing team to update copy and imagery without developer intervention. Lighthouse performance score stays above 95 thanks to image optimization and code splitting.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Framer Motion",
      "Tailwind CSS",
      "Figma",
    ],
    demo: "https://agency-website-demo.com",
    repository: "https://github.com/AngelThunder/agency-website",
    img: "/images/projects/agency-website-cover-image.jpg",
    tags: "Web Site • TypeScript • NextJS",
    featured: false,
  },
  {
    id: 6,
    slug: "fashion-studio",
    title: "Fashion Studio E-commerce",
    summary:
      "A full-stack e-commerce platform with product catalog, cart management and Stripe checkout.",
    description:
      "An end-to-end fashion e-commerce application featuring a product catalog with dynamic filtering, a persistent shopping cart backed by Redux, and secure payments via Stripe. The Node.js API layer handles inventory, orders, and webhook-based payment confirmation. SASS modules provide a custom design system that adapts from mobile to wide desktop.",
    technologies: ["React", "SASS", "Redux", "Node.js", "PostgreSQL"],
    outcomes:
      "Reduced cart abandonment by 30% through streamlined one-page checkout flow.",
    demo: "https://fashion-studio-demo.com",
    repository: "https://github.com/AngelThunder/fashion-studio",
    img: "/images/projects/fashion-studio-website.jpg",
    tags: "E-commerce • JavaScript • React",
    featured: false,
  },
];

export default projectsMock;
