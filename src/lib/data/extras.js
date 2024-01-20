const all = () => [
  {
    email: "angel.szymczak@hotmail.com",
    number: 50,
    subtitle: "satisfied customers",
  },
  {
    email: "angel.szymczak@hotmail.com",
    number: 40,
    subtitle: "projects completed",
  },
  {
    email: "angel.szymczak@hotmail.com",
    number: 4,
    subtitle: "years of experience",
  },
];

export async function fetchExtras({ email }) {
  try {
    return await all().filter((item) => item.email === email);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Extras.");
  }
}
