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
    repository: "https://github.com/angelpixel-core/crypto-screener",
    img: "/images/projects/crypto-screener-cover-image.jpg",
    screenshots: ["/images/projects/crypto-screener-cover-image.jpg"],
    tags: "Realtime Market Analytics • BackOffice • React • Tailwind • Context API",
    featured: true,
    priority: 60,
    status: "in-progress",
    technicalHighlights: [
      "Real-time data stream",
      "Client-side cache strategy",
      "Live chart monitoring",
      "Modular UI composition",
    ],
    featuredCard: {
      ribbon: {
        text: "Incoming",
        variant: "wip",
      },
    },
    visible: false,
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
    repository: "https://github.com/angelpixel-core/portfolio",
    img: "/images/projects/portfolio-cover-image.jpg",
    tags: "Web Site • JavaScript • NextJS",
    featured: false,
    priority: 50,
    status: "live",
    visible: false,
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
    repository: "https://github.com/angelpixel-core/devdreaming",
    img: "/images/projects/devdreaming.jpg",
    tags: "Blog • JavaScript • NextJS",
    featured: false,
    priority: 40,
    status: "live",
    visible: false,
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
    repository: "https://github.com/angelpixel-core/nft-marketplace",
    img: "/images/projects/nft-collection-website-cover-image.jpg",
    tags: "Marketplace Systems • Web3 • Ethereum",
    featured: true,
    priority: 30,
    status: "live",
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
    visible: false,
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
    repository: "https://github.com/angelpixel-core/agency-website",
    img: "/images/projects/agency-website-cover-image.jpg",
    tags: "Web Site • TypeScript • NextJS",
    featured: false,
    priority: 20,
    status: "live",
    visible: false,
  },
  {
    id: 6,
    slug: "fashion-studio",
    title: "Fashion Studio E-com",
    summary:
      "A full-stack e-commerce platform with product catalog, cart management and Stripe checkout.",
    description:
      "An end-to-end fashion e-commerce application featuring a product catalog with dynamic filtering, a persistent shopping cart backed by Redux, and secure payments via Stripe. The Node.js API layer handles inventory, orders, and webhook-based payment confirmation. SASS modules provide a custom design system that adapts from mobile to wide desktop.",
    technologies: ["React", "SASS", "Redux", "Node.js", "PostgreSQL"],
    outcomes:
      "Reduced cart abandonment by 30% through streamlined one-page checkout flow.",
    demo: "https://fashion-studio-demo.com",
    repository: "https://github.com/angelpixel-core/fashion-studio",
    img: "/images/projects/fashion-studio-website.jpg",
    tags: "E-commerce • JavaScript • React",
    featured: false,
    priority: 10,
    status: "live",
    visible: false,
  },
  {
    id: 7,
    slug: "financial-core-simulator",
    title: "Financial Core Simulator",
    summary:
      "Simulation engine for financial strategies with deterministic execution, CLI/API interfaces, and admin dashboard visualization.",
    description:
      "Financial Core Simulator (FCS) is a modular engine designed to process financial event streams and simulate portfolio behavior under different accounting models (FIFO, average cost). It supports deterministic execution, reproducible runs, and artifact generation for auditability. The system exposes a CLI and HTTP API for execution and integrates with an admin dashboard for visualization, validation, and operational workflows. Built with a domain-driven architecture, it separates core logic from delivery layers, enabling extensibility across web, API, and batch processing contexts.",
    technologies: [
      "Ruby",
      "Roda",
      "Ruby on Rails",
      "Avo",
      "PostgreSQL",
      "Dry-rb",
      "RSpec",
      "Mutant",
    ],
    img: "/images/projects/fcs/landing.png",
    screenshots: [
      "/images/projects/fcs/landing.png",
      "/images/projects/fcs/arch/hero.png",
      "/images/projects/fcs/arch/extended.png",
    ],
    tags: "Fintech • Simulation Engine • Domain-Driven Design • Web3-ready",
    featured: true,
    priority: 90,
    status: "shipped",
    sections: [
      {
        title: "Operational Overview",
        body: "The admin starts with a real-time operational snapshot so back-office teams can decide in seconds if results are trusted or require investigation.",
        bullets: [
          "PnL KPIs (realized/unrealized) with daily deltas",
          "Latest run status and processing time",
          "Data-quality alerts for missing, duplicated, or outlier records",
          "FX coverage indicators by currency pair",
        ],
        image: "/images/projects/fcs/overview.png",
        imageAlt:
          "FCS operational overview dashboard with trade volume and daily PnL charts",
      },
      {
        title: "FX Rates & Monetary Consistency",
        body: "FX conversion is the first place inconsistencies appear. The panel surfaces current rates, provenance, and historical variance so operators can spot anomalies fast.",
        bullets: [
          "Live FX table by currency pair",
          "Source and timestamp for each rate",
          "Delta vs. previous rate",
          "Historical chart per pair",
        ],
        image: "/images/projects/fcs/rates.png",
        imageAlt: "FX rates history table with upload panel and filters",
      },
      {
        title: "Pipeline Health & Data Quality",
        body: "Health checks determine if the pipeline can produce reliable outputs. Each check includes severity, impact, and direct navigation to the run detail.",
        bullets: [
          "Out-of-order trades and inconsistent timestamps",
          "Duplicates and missing records",
          "Incomplete snapshots",
          "Parsing errors or invalid formats",
        ],
        imageRef:
          "Health panel listing checks with severity and links to run details.",
      },
      {
        title: "Runs: History, Filters, Traceability",
        body: "The runs view is the operational core. It lets teams filter, inspect, and compare outputs across time and model versions.",
        bullets: [
          "Run list with status, timestamps, and model version",
          "Filters by date range, status, user, and dataset",
          "Direct access to artifacts (result.json, pnl.csv, positions.csv)",
          "Run-to-run comparison to detect differences",
        ],
        imageRef: "Runs table with date/status filters and comparison actions.",
      },
      {
        title: "Run Detail & Core Charts",
        body: "Each run answers three questions: was it successful, is it consistent with prior runs, and can it be audited.",
        bullets: [
          "Processed input summary",
          "PnL charts by date and instrument",
          "Position and exposure distributions",
          "Validation logs and warnings",
        ],
        imageRef: "Run detail view with PnL charts and validation log.",
      },
      {
        title: "Export & Audit Evidence",
        body: "Every operational dashboard needs defensible export trails for compliance and auditing.",
        bullets: [
          "One-click artifact downloads",
          "PDF report generation with charts",
          "Audit trail for export ownership",
        ],
        imageRef: "Export section with download buttons and PDF report action.",
      },
    ],
    featuredCard: {
      ribbon: {
        text: "Shipped",
        variant: "shipped",
      },
      contextBadges: [
        "CLI + API",
        "Deterministic Runs",
        "Admin Dashboard",
        "Auditability",
      ],
      focusLine:
        "Core financial simulation engine with deterministic execution and multi-interface architecture.",
      architecture: {
        image: "/images/projects/fcs/arch/hero.png",
        alt: "FCS architecture showing core engine, API adapter, CLI interface, and admin dashboard",
        caption:
          "Modular architecture separating core financial engine from delivery layers (CLI, API, admin UI) with deterministic execution and artifact generation.",
      },
    },
    repository: "https://github.com/angelpixel-core/financial-core-simulator",
    visible: true,
  },
  {
    id: 8,
    slug: "erc20-token-toolkit",
    title: "ERC20 Token Toolkit",
    summary:
      "Local-first ERC20 faucet + trading simulator with on-chain event tracing and wallet integration.",
    description:
      "A Web3 developer toolkit that simulates the full ERC20 lifecycle: minting (faucet), wallet distribution, approvals, and basic trading flows. Built as a local-first dApp using Anvil, it integrates wallet connection (MetaMask), real-time event inspection, and a minimal trading engine (buy/sell, orderbook, trade tape). The system exposes on-chain behaviors through a clean UI, enabling rapid validation of token mechanics, debugging of contract interactions, and reproducible testing of Web3 flows without external dependencies.",
    technologies: [
      "TypeScript",
      "Solidity",
      "Next.js",
      "wagmi",
      "viem",
      "Anvil (Foundry)",
      "MetaMask",
      "ERC20",
    ],
    img: "/images/projects/incoming/erc20-token.png",
    tags: "Web3 • Token Infrastructure • On-chain Simulation • Trading",
    featured: false,
    priority: 90,
    status: "in-progress",
    repository: "https://github.com/angelpixel-core/erc20-faucet-sol-dapp",
    featuredCard: {
      ribbon: {
        text: "Incoming",
        variant: "wip",
      },
      contextBadges: [
        "Local-first",
        "Anvil",
        "Wallet Connect",
        "On-chain Events",
      ],
      focusLine:
        "Simulate ERC20 flows end-to-end: faucet → wallet → trading → events.",
      architecture: {
        image: "/images/projects/incoming/erc20-token-arch.png",
        caption:
          "Frontend dApp (Next.js + wagmi/viem) connected to a local Anvil node. Smart contracts handle token logic (mint, transfer, approve), while the UI consumes on-chain state and events directly via RPC without backend indexing.",
      },
    },
    visible: true,
  },
  {
    id: 9,
    slug: "e-commerce",
    title: "E-commerce Orchest",
    summary:
      "A commerce ops platform covering catalog ingestion, inventory sync, and order routing.",
    description:
      "A unified operations layer for multi-channel commerce that normalizes product catalogs, keeps inventory in sync, and coordinates fulfillment routing. The experience pairs merchandising controls with reporting dashboards so teams can track sell-through and stock health in real time.",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis"],
    img: "/images/projects/incoming/e-commerce.png",
    tags: "Commerce Ops • Inventory • TypeScript",
    featured: false,
    priority: 70,
    status: "planned",
    featuredCard: {
      ribbon: {
        text: "Planned",
        variant: "planned",
      },
    },
    visible: true,
  },
];

export default projectsMock;
