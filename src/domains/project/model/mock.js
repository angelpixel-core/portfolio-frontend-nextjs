const projectsMock = [
  {
    id: 1,
    slug: "crypto-screener",
    title: "Crypto Screener Application",
    summary:
      "A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts.",
    description:
      "This comprehensive cryptocurrency screening application provides real-time market data analysis, portfolio tracking, and advanced filtering capabilities. Built with a modern React architecture, it features interactive charts powered by Recharts, responsive design with Tailwind CSS, and efficient state management using Context API. Users can track multiple cryptocurrencies, set price alerts, and analyze market trends through an intuitive dashboard interface.",
    technologies: [
      "React",
      "Tailwind CSS",
      "Context API",
      "React Router",
      "Recharts",
      "JavaScript",
    ],
    outcomes:
      "Achieved 50% faster load times compared to similar apps through optimized data fetching and caching strategies.",
    demo: "https://crypto-screener-demo.com",
    repository: "https://github.com/AngelThunder/crypto-screener",
    img: "/images/projects/crypto-screener-cover-image.jpg",
    screenshots: [
      "/images/projects/crypto-screener-dashboard.jpg",
      "/images/projects/crypto-screener-charts.jpg",
    ],
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
];
export default projectsMock;
