export function fetchExtras() {
  try {
    const extras = [
      { number: 50, subtitle: "satisfied customers" },
      { number: 40, subtitle: "projects completed" },
      { number: 4, subtitle: "years of experience" },
    ];

    return extras;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch extras.");
  }
}
