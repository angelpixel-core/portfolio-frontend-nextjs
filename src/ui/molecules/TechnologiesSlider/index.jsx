"use client";

import "./styles.css";
import {
  ReactIcon,
  NextIcon,
  TypeScriptIcon,
  NodeIcon,
  RubyIcon,
  RailsIcon,
  PostgresIcon,
  DockerIcon,
  JavaScriptIcon,
  HTML5Icon,
  CSS3Icon,
  TailwindIcon,
  SASSIcon,
  LinuxIcon,
  BashIcon,
  JenkinsIcon,
  KafkaIcon,
  StorybookIcon,
  TerraformIcon,
  PulumiIcon,
  RedisIcon,
  GraphQLIcon,
  MongoIcon,
  ReduxIcon,
  GitIcon,
  FigmaIcon,
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

const technologies = [
  { id: 1, name: "React", Icon: ReactIcon },
  { id: 2, name: "Next.js", Icon: NextIcon },
  { id: 3, name: "TypeScript", Icon: TypeScriptIcon },
  { id: 4, name: "Node.js", Icon: NodeIcon },
  { id: 5, name: "Ruby", Icon: RubyIcon },
  { id: 6, name: "Ruby on Rails", Icon: RailsIcon },
  { id: 7, name: "PostgreSQL", Icon: PostgresIcon },
  { id: 8, name: "MongoDB", Icon: MongoIcon },
  { id: 9, name: "Redis", Icon: RedisIcon },
  { id: 10, name: "GraphQL", Icon: GraphQLIcon },
  { id: 11, name: "Docker", Icon: DockerIcon },
  { id: 12, name: "JavaScript", Icon: JavaScriptIcon },
  { id: 13, name: "HTML5", Icon: HTML5Icon },
  { id: 14, name: "CSS3", Icon: CSS3Icon },
  { id: 15, name: "Tailwind", Icon: TailwindIcon },
  { id: 16, name: "SASS", Icon: SASSIcon },
  { id: 17, name: "Linux", Icon: LinuxIcon },
  { id: 18, name: "Bash", Icon: BashIcon },
  { id: 19, name: "Jenkins", Icon: JenkinsIcon },
  { id: 20, name: "Kafka", Icon: KafkaIcon },
  { id: 21, name: "Storybook", Icon: StorybookIcon },
  { id: 22, name: "Terraform", Icon: TerraformIcon },
  { id: 23, name: "Pulumi", Icon: PulumiIcon },
  { id: 24, name: "Redux", Icon: ReduxIcon },
  { id: 25, name: "Git", Icon: GitIcon },
  { id: 26, name: "Figma", Icon: FigmaIcon },
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
