import type { ComponentType } from "react";

import ReactIcon from "@/atoms/icons/ReactIcon";
import TypeScriptIcon from "@/atoms/icons/TypeScriptIcon";
import NextIcon from "@/atoms/icons/NextIcon";
import NodeIcon from "@/atoms/icons/NodeIcon";
import TailwindIcon from "@/atoms/icons/TailwindIcon";
import PostgresIcon from "@/atoms/icons/PostgresIcon";
import DockerIcon from "@/atoms/icons/DockerIcon";
import JavaScriptIcon from "@/atoms/icons/JavaScriptIcon";
import HTML5Icon from "@/atoms/icons/HTML5Icon";
import CSS3Icon from "@/atoms/icons/CSS3Icon";
import SASSIcon from "@/atoms/icons/SASSIcon";
import ReduxIcon from "@/atoms/icons/ReduxIcon";
import GraphQLIcon from "@/atoms/icons/GraphQLIcon";
import MongoIcon from "@/atoms/icons/MongoIcon";
import RedisIcon from "@/atoms/icons/RedisIcon";
import GitIcon from "@/atoms/icons/GitIcon";
import RubyIcon from "@/atoms/icons/RubyIcon";
import RailsIcon from "@/atoms/icons/RailsIcon";
import SvelteIcon from "@/atoms/icons/SvelteIcon";
import RustIcon from "@/atoms/icons/RustIcon";
import KafkaIcon from "@/atoms/icons/KafkaIcon";
import JenkinsIcon from "@/atoms/icons/JenkinsIcon";
import TerraformIcon from "@/atoms/icons/TerraformIcon";
import HerokuIcon from "@/atoms/icons/HerokuIcon";
import BashIcon from "@/atoms/icons/BashIcon";
import UnixIcon from "@/atoms/icons/UnixIcon";
import LinuxIcon from "@/atoms/icons/LinuxIcon";
import RSpecIcon from "@/atoms/icons/RSpecIcon";
import CucumberIcon from "@/atoms/icons/CucumberIcon";
import FigmaIcon from "@/atoms/icons/FigmaIcon";
import StorybookIcon from "@/atoms/icons/StorybookIcon";
import SolidityIcon from "@/atoms/icons/SolidityIcon";
import ViemIcon from "@/atoms/icons/ViemIcon";
import WagmiIcon from "@/atoms/icons/WagmiIcon";
import DryRbIcon from "@/atoms/icons/DryRbIcon";
import MetaMaskIcon from "@/atoms/icons/MetaMaskIcon";
import QuestionIcon from "@/atoms/icons/QuestionIcon";

/**
 * Mapping of technology names to their icon components.
 * Keys are case-insensitive (normalized to lowercase for lookup).
 */
const TECH_ICON_MAP: Record<string, ComponentType> = {
  // JavaScript ecosystem
  react: ReactIcon,
  "react.js": ReactIcon,
  "context api": ReactIcon,
  "react router": ReactIcon,
  "react-router": ReactIcon,
  "framer motion": ReactIcon,
  "framer-motion": ReactIcon,
  typescript: TypeScriptIcon,
  ts: TypeScriptIcon,
  javascript: JavaScriptIcon,
  js: JavaScriptIcon,
  "next.js": NextIcon,
  nextjs: NextIcon,
  next: NextIcon,
  vercel: NextIcon,
  "node.js": NodeIcon,
  nodejs: NodeIcon,
  node: NodeIcon,
  redux: ReduxIcon,
  svelte: SvelteIcon,
  mdx: JavaScriptIcon,
  wagmi: WagmiIcon,
  viem: ViemIcon,
  metamask: MetaMaskIcon,
  "meta mask": MetaMaskIcon,

  // CSS
  tailwind: TailwindIcon,
  tailwindcss: TailwindIcon,
  "tailwind css": TailwindIcon,
  css: CSS3Icon,
  css3: CSS3Icon,
  "styled components": CSS3Icon,
  "styled-components": CSS3Icon,
  sass: SASSIcon,
  scss: SASSIcon,
  html: HTML5Icon,
  html5: HTML5Icon,

  // Databases
  postgresql: PostgresIcon,
  postgres: PostgresIcon,
  prisma: PostgresIcon,
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
  avo: RubyIcon,
  roda: RubyIcon,
  "dry-rb": DryRbIcon,
  mutant: RSpecIcon,
  rails: RailsIcon,
  "ruby on rails": RailsIcon,

  // Other languages
  rust: RustIcon,
  solidity: SolidityIcon,
  erc20: SolidityIcon,
  "erc-20": SolidityIcon,
  anvil: SolidityIcon,
  "anvil (foundry)": SolidityIcon,

  // Shell/OS
  bash: BashIcon,
  shell: BashIcon,
  unix: UnixIcon,
  linux: LinuxIcon,

  // Testing
  rspec: RSpecIcon,
  cucumber: CucumberIcon,

  // Design tools
  figma: FigmaIcon,
  storybook: StorybookIcon,
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
