const all = () => [
  {
    email: "angel.szymczak@hotmail.com",
    position: "Software Engineer",
    company: "Google",
    companyLink: "https://google.com",
    time: "2022-Present",
    address: "Mountain View, CA",
    work: "Worked on a team responsible for developing new features for Google's search engine, including improving the accuracy and relevance of search results and developing new tools for data analysis and visualization.",
  },
  {
    email: "angel.szymczak@hotmail.com",
    position: "Intern",
    company: "Facebook",
    companyLink: "https://facebook.com",
    time: "Summer 2021",
    address: "Menlo Park, CA",
    work: "Worked on a team responsible for developing a new mobile app feature that allowed users to create and share short-form video content, including designing and implementing a new user interface and developing the backend infrastructure to support the feature.",
  },
  {
    email: "angel.szymczak@hotmail.com",
    position: "Software Developer",
    company: "Amazon",
    companyLink: "https://amazon.com",
    time: "2020-2021",
    address: "Seattle, WA",
    work: "Worked on a team responsible for developing Amazon's mobile app, including implementing new features such as product recommendations and user reviews, and optimizing the app's performance and reliability.",
  },
  {
    email: "angel.szymczak@hotmail.com",
    position: "Software Developer Intern",
    company: "Microsoft",
    companyLink: "https://microsoft.com",
    time: "Summer 2019",
    address: "Redmond, WA",
    work: "Worked on a team responsible for developing new features for Microsoft's Windows operating system, including implementing a new user interface for a system settings panel and optimizing the performance of a core system component.",
  },
  {
    email: "angel.szymczak@hotmail.com",
    position: "Teaching Assistant",
    company: "MIT",
    companyLink: "https://mit.com",
    time: "Fall 2018",
    address: "Massachusetts Ave, Cambridge, MA",
    work: "Assisted in teaching a course on computer programming, held office hours to help students with assignments, and graded exams and assignments.",
  },
];

export async function fetchExperiences({ email }) {
  try {
    return await all().filter((item) => item.email === email);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Experiences.");
  }
}
