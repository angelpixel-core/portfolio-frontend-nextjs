"use client";

import "./styles.css";
import {
  ReactIcon,
  NextIcon,
  TypeScriptIcon,
  NodeIcon,
  RailsIcon,
  PostgresIcon,
  DockerIcon,
  JavaScriptIcon,
  TailwindIcon,
  LinuxIcon,
  RedisIcon,
  GraphQLIcon,
  MongoIcon,
  ReduxIcon,
  GitIcon,
} from "@/icons";

/**
 * TechnologiesSlider - Infinite scrolling icon slider for technologies
 *
 * Features:
 * - CSS-only infinite animation (reverse direction from CustomersSlider)
 * - Duplicated items for seamless loop
 * - Respects prefers-reduced-motion
 * - Half height of CustomersSlider
 * - Same grayscale/hover effects
 *
 * Visible from 880px+ breakpoint
 */

// Reduced from 26 to 15 technologies for DOM optimization
// Lighthouse: Avoid excessive DOM size (52 → 30 child elements)
const technologies = [
  { id: 1, name: "React", Icon: ReactIcon },
  { id: 2, name: "Next.js", Icon: NextIcon },
  { id: 3, name: "TypeScript", Icon: TypeScriptIcon },
  { id: 4, name: "Node.js", Icon: NodeIcon },
  { id: 5, name: "Ruby on Rails", Icon: RailsIcon },
  { id: 6, name: "PostgreSQL", Icon: PostgresIcon },
  { id: 7, name: "MongoDB", Icon: MongoIcon },
  { id: 8, name: "Redis", Icon: RedisIcon },
  { id: 9, name: "GraphQL", Icon: GraphQLIcon },
  { id: 10, name: "Docker", Icon: DockerIcon },
  { id: 11, name: "JavaScript", Icon: JavaScriptIcon },
  { id: 12, name: "Tailwind", Icon: TailwindIcon },
  { id: 13, name: "Linux", Icon: LinuxIcon },
  { id: 14, name: "Redux", Icon: ReduxIcon },
  { id: 15, name: "Git", Icon: GitIcon },
];

const TechnologiesSlider = () => {
  // Duplicate the array for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <div className="technologies-slider" data-testid="technologies-slider">
      <div className="technologies-slider__track">
        {duplicatedTechnologies.map((tech, idx) => (
          <div
            key={`${tech.id}-${idx}`}
            className="technologies-slider__slide"
            title={tech.name}
          >
            <svg
              className="technologies-slider__icon"
              viewBox="0 0 128 128"
              aria-label={tech.name}
            >
              <tech.Icon />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnologiesSlider;
