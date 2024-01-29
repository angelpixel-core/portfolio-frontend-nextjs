const all = () => [
  {
    email: "angel.szymczak@hotmail.com",
    content: [
      "Hi, I'm Angel Szymczak, a Full Stack Web Developer passionate about creating beautiful, functional, goal-driven, and user-centric digital experiences.",
      "With 6 years of experience in the field. I am always looking for new and innovative ways to bring my clients' visions to life.",
      "I believe that design is about more than just making things look pretty.",
      "it's about solving problems and creating intuitive, enjoyable experiences for users.",
      "Whether I'm working on a website, frontend, backend, distributed systems, or other digital product, I bring my commitment to quality excellence and user-centered thinking to every project I work on. I look forward to the opportunity to bring my skills and passion to your next project.",
    ],
  },
];

export async function fetchBiography({ email }) {
  return await all().find((item) => item.email === email);
}
