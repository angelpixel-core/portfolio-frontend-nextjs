import type { ComponentType } from "react";

import {
  ReactIcon,
  TypeScriptIcon,
  NextIcon,
  NodeIcon,
  TailwindIcon,
  PostgresIcon,
  DockerIcon,
  JavaScriptIcon,
  HTML5Icon,
  CSS3Icon,
  SASSIcon,
  ReduxIcon,
  GraphQLIcon,
  MongoIcon,
  RedisIcon,
  GitIcon,
  RubyIcon,
  RailsIcon,
  SvelteIcon,
  RustIcon,
  KafkaIcon,
  JenkinsIcon,
  TerraformIcon,
  HerokuIcon,
  QuestionIcon,
} from "@/atoms/icons";

/**
 * Mapping of technology names to their icon components.
 * Keys are case-insensitive (normalized to lowercase for lookup).
 */
const TECH_ICON_MAP: Record<string, ComponentType> = {
  // JavaScript ecosystem
  react: ReactIcon,
  "react.js": ReactIcon,
  typescript: TypeScriptIcon,
  ts: TypeScriptIcon,
  javascript: JavaScriptIcon,
  js: JavaScriptIcon,
  "next.js": NextIcon,
  nextjs: NextIcon,
  next: NextIcon,
  "node.js": NodeIcon,
  nodejs: NodeIcon,
  node: NodeIcon,
  redux: ReduxIcon,
  svelte: SvelteIcon,

  // CSS
  tailwind: TailwindIcon,
  tailwindcss: TailwindIcon,
  "tailwind css": TailwindIcon,
  css: CSS3Icon,
  css3: CSS3Icon,
  sass: SASSIcon,
  scss: SASSIcon,
  html: HTML5Icon,
  html5: HTML5Icon,

  // Databases
  postgresql: PostgresIcon,
  postgres: PostgresIcon,
  mongodb: MongoIcon,
  mongo: MongoIcon,
  redis: RedisIcon,
  graphql: GraphQLIcon,
  kafka: KafkaIcon,

  // DevOps
  docker: DockerIcon,
  git: GitIcon,
  jenkins: JenkinsIcon,
  terraform: TerraformIcon,
  heroku: HerokuIcon,

  // Ruby
  ruby: RubyIcon,
  rails: RailsIcon,
  "ruby on rails": RailsIcon,

  // Other languages
  rust: RustIcon,
};

/**
 * Gets the icon component for a given technology name.
 * Falls back to QuestionIcon for unknown technologies.
 *
 * @param techName - The technology name to look up
 * @returns The corresponding icon component
 */
export function getTechIcon(techName: string): ComponentType {
  const normalizedName = techName.toLowerCase().trim();
  return TECH_ICON_MAP[normalizedName] || QuestionIcon;
}

/**
 * Checks if a technology has a known icon.
 *
 * @param techName - The technology name to check
 * @returns true if the technology has a known icon
 */
export function hasTechIcon(techName: string): boolean {
  const normalizedName = techName.toLowerCase().trim();
  return normalizedName in TECH_ICON_MAP;
}
