export const fetchSkills = () => {
  try {
    const skills = [
      { name: "Web", x: "", y: "" },
      { name: "HTML", x: "-22vw", y: "2vw" },
      { name: "CSS", x: "-5vw", y: "-10vw" },
      { name: "JavaScript", x: "20vw", y: "6vw" },
      { name: "TypeScript", x: "0vw", y: "12vw" },
      { name: "ReactJS", x: "-20vw", y: "-15vw" },
      { name: "NextJS", x: "15vw", y: "-12vw" },
      { name: "Web Design", x: "32vw", y: "-5vw" },
      { name: "Figma", x: "0vw", y: "-20vw" },
      { name: "Ruby", x: "-18vw", y: "14vw" },
      { name: "Ruby on Rails", x: "18vw", y: "18vw" },
      { name: "Tailwind CSS", x: "-30vw", y: "-4vw" },
    ];

    return skills;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch skills.");
  }
};
