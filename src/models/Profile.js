// TODO: continuar con la integracion con la API
// import { fetchData } from "@/lib/apiService";

const profiles = [
  {
    id: 1,
    email: "angel@zymchak.dev",
    brand: "Angel Szymczak",
    resume:
      "https://docs.google.com/document/d/1WlMmGQIbK1nE5qYutWwtN7CLD4f0nu-d",
    calendly: "https://calendly.com/angelszymczak",
    telegram: "https:/t.me/angel.stack",
    github: "https://github.com/angel.stack",
    whatsapp: "https://api.whatsapp.com/send?phone=+19595006965",
    linkedin: "https://www.linkedin.com/in/angelszymczak",
    year: 2025,
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

const fetchBy = async ({ email }) => {
  const profile = profiles.find((p) => p.email === email);

  if (!profile) throw new Error(`Profile with email "${email}" not found`);

  return profile;
};

const Profile = {
  fetchBy,
};

export default Profile;
