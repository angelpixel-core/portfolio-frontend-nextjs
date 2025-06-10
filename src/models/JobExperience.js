const experiences = [
  {
    id: 1,
    position: "Independant",
    company: "Consulting Service",
    companyLink: "https://portfolio-developer-nextjs.vercel.app/",
    industry: "Software Solutions",
    time: "Fall 2023",
    address: "Remote",
    work: "I collaborated with Chief Technology Officers (CTOs), Product Owners, Project Managers and their teams to enhance their services platform. The primary focus was on adding new features, planning deliveries, achieving new integrations, scaling solutions, improving security, defining task plans for developers, enhancing the overall end-user experience for web applications, and providing coaching for new team members.",
  },
  {
    id: 1,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    industry: "Real Estate Brokerage",
    time: "Dec 2021, Aug 2022",
    address: "New York, United States",
    work: "A significant part of my role involved code maintenance and enhancement. I diligently removed and refactored code, addressing technical debt, and implemented feature flags to ensure a more flexible and adaptable codebase. Additionally, I delved into database query optimization, enhancing overall system performance, and actively participated in bug fixing to uphold system reliability.",
  },
  {
    id: 1,
    position: "Software Engineer L3",
    company: "SouthWorks",
    companyLink: "https://www.southworks.com/",
    industry: "Custom Software Development",
    time: "May 2020, Sept 2021",
    address: "Delawere, United States",
    work: "Incorporating leadership tasks, I took on a pivotal role in project management. This involved overseeing dashboards, assigning tasks, leading sprint planning sessions, and acting as a facilitator for delivering key milestones. This multifaceted approach showcased not only technical acumen but also leadership and organizational skills in steering projects towards successful outcomes.",
  },
  {
    id: 1,
    position: "FullStack Engineer L2",
    company: "Nubi",
    companyLink: "https://www.tunubi.com/",
    industry: "Cross-Border Payments",
    time: "Sept 2019, May 2020",
    address: "Buenos Aires, Argentina",
    work: "I spearheaded impactful initiatives, showcasing a blend of technical expertise and strategic problem-solving. I proposed and successfully implemented an auditory asynchronous service, optimizing the entire transaction remittance processing workflow. This innovation not only improved efficiency but also enhanced the reliability of transaction auditing. Recognizing the importance of regulatory compliance, I undertook the redesign of fee calculations, aligning them with Argentina's tax regulations.",
  },
  {
    id: 1,
    position: "FullStack Developer",
    company: "Bitex",
    companyLink: "https://www.bitex.la/",
    industry: "B2B Crypto Marketplace",
    time: "Dec 2017, May 2019",
    address: "Amsterdam, Netherlands",
    work: "I played a pivotal role in the financial technology sector, implementing strategic initiatives to enhance market operations and streamline asset management. Throughout these endeavors, my role involved a deep understanding of financial markets, strategic thinking in implementing automated trading strategies, and the creation of tools to streamline API interactions for efficient asset management.",
  },
];

async function all() {
  return experiences;
}

async function fetchBy({ id }) {
  return experiences.filter((exp) => exp.id == id);
}

export const JobExperience = {
  all,
  fetchBy,
};
