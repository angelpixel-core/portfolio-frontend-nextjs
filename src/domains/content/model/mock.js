/**
 * Content Mock Data
 *
 * Content values are sourced from environment variables for:
 * - Staging/production configuration
 * - Easy updates without code changes
 * - Local development with real content
 *
 * @see .env.template for required variables
 */
const contentsMock = [
  {
    id: 1,
    title:
      process.env.NEXT_PUBLIC_HOME_TITLE || "Full-Stack Developer",
    slug: "landing",
    description:
      process.env.NEXT_PUBLIC_HOME_DESCRIPTION ||
      "Turning Vision Into Code-Reality. A skilled Full-Stack developer dedicated to scalable web solutions.",
    mainContent:
      process.env.NEXT_PUBLIC_HOME_CONTENT ||
      "As a skilled Full-Stack developer, I am dedicated to turning ideas into Scalable Web Solutions. Explore my latest projects and articles, showcasing my expertise in Ruby + Rails and HTML, CSS, JavaScript + React/NextJS.",
  },
  {
    id: 2,
    title: process.env.NEXT_PUBLIC_ABOUT_TITLE || "About Me",
    slug: "about",
    description:
      process.env.NEXT_PUBLIC_ABOUT_DESCRIPTION ||
      "Passion Fuels Purpose — building solutions that empower users.",
    mainContent:
      process.env.NEXT_PUBLIC_ABOUT_CONTENT ||
      "I believe that design is about more than just making things look pretty — it's about solving problems and creating intuitive, enjoyable experiences for users.",
  },
];

export default contentsMock;
