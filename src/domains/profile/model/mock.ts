/**
 * Profile Mock Data
 *
 * Static profile fixtures used for tests and local development.
 */
import type { ProfilesModel } from "./schema";

const DEFAULT_BIOGRAPHY = [
  "Hi, I'm a Full Stack Developer passionate about creating user-centric digital experiences.",
  "With expertise in modern web technologies, I build scalable applications that solve real-world problems.",
  "I'm constantly learning and adapting to new technologies to deliver the best solutions.",
];

const profilesMock: ProfilesModel = [
  {
    id: 1,
    // Identity
    nickname: "portfolio-owner",
    authorName: "Author",
    biography: DEFAULT_BIOGRAPHY,
    location: "Location",

    // Images
    avatar: "/images/profile/hero.png",
    logo: "/images/logo.svg",

    // Contact
    email: "contact@example.com",

    // Social URLs (built from env identifiers)
    linkedin: "https://linkedin.com/in/username",
    github: "https://github.com/username",
    twitter: "https://twitter.com/username",
    dribbble: "https://dribbble.com/username",
    telegram: "https://t.me/username",
    whatsapp: "https://wa.me/5491100000000",
    calendly: "https://calendly.com/username",

    // Action URLs
    resume: "#",
    heroLink: "https://linkedin.com/in/username",
    hireMeLink: "https://t.me/username",
  },
];

export default profilesMock;
