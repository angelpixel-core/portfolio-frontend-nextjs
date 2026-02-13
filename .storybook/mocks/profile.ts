/**
 * Storybook-only fake profile mock data (Lorem Ipsum)
 * Replaces real profile data via NormalModuleReplacementPlugin
 */
import type { ProfilesModel } from "@/domains/profile/model/schema";

const profilesMock: ProfilesModel = [
  {
    id: 1,
    nickname: "lorem-dev",
    authorName: "Lorem Ipsum",
    biography: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      "Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    ],
    avatar: "/images/profile/hero.png",
    logo: "/images/logo.svg",
    location: "Lorem City, Placeholder",
    email: "lorem@example.com",
    linkedin: "https://example.com/in/loremipsum",
    github: "https://example.com/loremipsum",
    twitter: "https://example.com/loremipsum",
    dribbble: "https://example.com/loremipsum",
    telegram: "https://example.com/loremipsum",
    whatsapp: "https://example.com/loremipsum",
    calendly: "https://example.com/loremipsum",
    resume: "#",
    heroLink: "https://example.com/loremipsum",
    hireMeLink: "https://example.com/loremipsum",
  },
];

export default profilesMock;
