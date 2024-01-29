const all = () => [
  {
    email: "angel.szymczak@hotmail.com",
    resume: process.env.RESUME_URL,
    calendly: "https://calendly.com/angelszymczak",
    telegram: "https:/t.me/angelszymczak",
  },
];

export function fetchProfile({ email }) {
  return all().find((item) => item.email === email);
}
