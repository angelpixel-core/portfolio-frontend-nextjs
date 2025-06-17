// import { fetchData } from "@/lib/apiService";

const profiles = [
  {
    email: "angel.szymczak@hotmail.com",
    brand: "Angel Szymczak",
    resume:
      "https://docs.google.com/document/d/1WlMmGQIbK1nE5qYutWwtN7CLD4f0nu-d",
    calendly: "https://calendly.com/angelszymczak",
    telegram: "https:/t.me/angelszymczak",
    github: "https://linkedin.com/in/angelszymczak",
    whatsapp: "https://api.whatsapp.com/send?phone=5491125839761",
    linkedin: "https://www.linkedin.com/in/angelszymczak",
    year: 2024,
    biography: [
      "Hi, I'm Angel Szymczak, a Full Stack Web Developer passionate about creating beautiful, functional, goal-driven, and user-centric digital experiences.",
      "With 6 years of experience in the field. I am always looking for new and innovative ways to bring my clients' visions to life.",
      "I believe that design is about more than just making things look pretty.",
      "it's about solving problems and creating intuitive, enjoyable experiences for users.",
      "Whether I'm working on a website, frontend, backend, distributed systems, or other digital product, I bring my commitment to quality excellence and user-centered thinking to every project I work on. I look forward to the opportunity to bring my skills and passion to your next project.",
    ],
    images: {
      hero: "/images/profile/hero.png",
      me: "/images/profile/me.svg",
    },
  },
];

async function fetchBy({ email }) {
  return profiles.find((profile) => profile.email === email);
}

export const Profile = {
  fetchBy,
};
