/**
 * Storybook-only fake project mock data (Lorem Ipsum)
 * Replaces real project data via NormalModuleReplacementPlugin
 */
import type { ProjectModel } from "@/domains/project/model/schema";

const projectsMock: ProjectModel[] = [
  {
    id: 1,
    slug: "lorem-dashboard",
    title: "Lorem Dashboard Application",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    outcomes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
    demo: "https://example.com/lorem-dashboard",
    repository: "https://example.com/repo/lorem-dashboard",
    img: "/images/projects/crypto-screener-cover-image.jpg",
    tags: "Dashboard \u2022 TypeScript \u2022 React",
    featured: true,
  },
  {
    id: 2,
    slug: "ipsum-portfolio",
    title: "Ipsum Portfolio Website",
    summary:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error.",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    outcomes:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.",
    demo: "https://example.com/ipsum-portfolio",
    repository: "https://example.com/repo/ipsum-portfolio",
    img: "/images/projects/portfolio-cover-image.jpg",
    tags: "Portfolio \u2022 Next.js \u2022 Motion",
    featured: false,
  },
  {
    id: 3,
    slug: "dolor-blog",
    title: "Dolor Blog Platform",
    summary:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
    technologies: ["React", "Redux", "GraphQL"],
    demo: "https://example.com/dolor-blog",
    img: "/images/projects/devdreaming.jpg",
    tags: "Blog \u2022 React \u2022 GraphQL",
    featured: false,
  },
  {
    id: 4,
    slug: "amet-marketplace",
    title: "Amet NFT Marketplace",
    summary:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
    technologies: ["React", "Web3.js", "Solidity", "Ethers.js"],
    outcomes:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit.",
    demo: "https://example.com/amet-marketplace",
    repository: "https://example.com/repo/amet-marketplace",
    img: "/images/projects/nft-collection-website-cover-image.jpg",
    tags: "Marketplace \u2022 Web3 \u2022 React",
    featured: true,
  },
  {
    id: 5,
    slug: "consectetur-agency",
    title: "Consectetur Agency Website",
    summary:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe.",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
    technologies: ["Next.js", "GSAP", "Prismic CMS"],
    demo: "https://example.com/consectetur-agency",
    img: "/images/projects/agency-website-cover-image.jpg",
    tags: "Agency \u2022 Next.js \u2022 CMS",
    featured: false,
  },
  {
    id: 6,
    slug: "adipiscing-ecommerce",
    title: "Adipiscing E-Commerce Platform",
    summary:
      "Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus.",
    description:
      "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.",
    technologies: ["React", "Stripe", "Node.js", "MongoDB"],
    outcomes: "Et harum quidem rerum facilis est et expedita distinctio.",
    demo: "https://example.com/adipiscing-ecommerce",
    repository: "https://example.com/repo/adipiscing-ecommerce",
    img: "/images/projects/fashion-studio-website.jpg",
    tags: "E-Commerce \u2022 Stripe \u2022 React",
    featured: true,
  },
];

export default projectsMock;
