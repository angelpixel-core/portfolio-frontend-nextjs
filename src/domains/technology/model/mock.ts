import { logger } from "@/lib/logger";
import type { TechnologiesModel } from "./schema";

/**
 * Technologies Mock Data
 *
 * Used for the word cloud visualization and skill display.
 */
const technologiesMock: TechnologiesModel = [
  { id: 1, name: "Ruby", status: "active", x: "8vw", y: "0vw" },
  { id: 2, name: "Rails", status: "active", x: "6vw", y: "5vw" },
  { id: 3, name: "JavaScript", status: "active", x: "2vw", y: "8vw" },
  { id: 4, name: "React", status: "active", x: "14vw", y: "0vw" },
  { id: 5, name: "Next", status: "active", x: "-20vw", y: "0vw" },
];

/**
 * Slider technology type (minimal, just id and name)
 */
interface SliderTechnology {
  id: number;
  name: string;
}

/**
 * Technologies for the infinite slider
 * Uses text-based display (no logo images needed)
 */
const defaultSliderTechnologies: SliderTechnology[] = [
  { id: 1, name: "React" },
  { id: 2, name: "Next.js" },
  { id: 3, name: "TypeScript" },
  { id: 4, name: "Node.js" },
  { id: 5, name: "Ruby on Rails" },
  { id: 6, name: "PostgreSQL" },
  { id: 7, name: "Docker" },
  { id: 8, name: "AWS" },
  { id: 9, name: "JavaScript" },
  { id: 10, name: "HTML/CSS" },
];

/**
 * Get technologies for the slider
 * @returns Array of technology objects with id, name
 */
export const getSliderTechnologies = (): SliderTechnology[] => {
  const envTechnologies = process.env.NEXT_PUBLIC_TECHNOLOGIES;
  if (envTechnologies) {
    try {
      return JSON.parse(envTechnologies) as SliderTechnology[];
    } catch (e) {
      logger.warn(
        "Technology",
        "Invalid NEXT_PUBLIC_TECHNOLOGIES JSON, using defaults"
      );
    }
  }
  return defaultSliderTechnologies;
};

export default technologiesMock;
