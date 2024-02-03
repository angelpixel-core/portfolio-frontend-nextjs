const all = () => [
  {
    email: "angel.szymczak@hotmail.com",
    brand: "Angel Szymczak",
    resume: process.env.RESUME_URL,
    calendly: "https://calendly.com/angelszymczak",
    telegram: "https:/t.me/angelszymczak",
    github: "https://linkedin.com/in/angelszymczak",
    whatsapp: "https://api.whatsapp.com/send?phone=5491125839761",
    linkedin: "https://www.linkedin.com/in/angelszymczak",
    year: 2024,
  },
];

export function fetchProfile({ email }) {
  return all().find((item) => item.email === email);
}

export async function asyncFetchProfile({ email }) {
  const profiles = all();

  return await profiles.find((item) => item.email === email);
}
