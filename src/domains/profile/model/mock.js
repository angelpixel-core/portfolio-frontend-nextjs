/**
 * Profile Mock Data
 *
 * External URLs are sourced from environment variables for:
 * - Staging/production configuration
 * - Single source of truth
 * - Easy updates without code changes
 *
 * @see .env.template for required variables
 */
const profilesMock = [
  {
    id: 1,
    nickname: "elvis",
    biography: [
      "Hi, I'm Angel Szymczak, a Full Stack Developer passionate about creating user-centric digital experiences.",
      "With expertise in modern web technologies, I build scalable applications that solve real-world problems.",
      "I'm constantly learning and adapting to new technologies to deliver the best solutions.",
    ],
    avatar: "@images/profile/hero.png",
    location: "La Plata, Argentina",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@amazingcompany.com",
    calendly:
      process.env.NEXT_PUBLIC_CALENDLY_URL ||
      "https://www.calendly.com/contact@amazingcompany.com",
    telegram:
      process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/angelszymczak",
    whatsapp:
      process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/5491122334455",
    resume: process.env.NEXT_PUBLIC_RESUME_URL || "#",
  },
];

export default profilesMock;
