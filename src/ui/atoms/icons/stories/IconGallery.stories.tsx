import type { ComponentType } from "react";
import { useRef } from "react";

import type { Meta, StoryObj } from "@storybook/react";

// Direct imports — ZERO barrel imports (CLAUDE.md anti-pattern rule)
import ArrowIcon from "../ArrowIcon";
import AWSIcon from "../AWSIcon";
import BashIcon from "../BashIcon";
import CalendarIcon from "../CalendarIcon";
import CalendlyIcon from "../CalendlyIcon";
import CheckIcon from "../CheckIcon";
import ChevronDownIcon from "../ChevronDownIcon";
import CopyIcon from "../CopyIcon";
import CSS3Icon from "../CSS3Icon";
import CucumberIcon from "../CucumberIcon";
import DockerIcon from "../DockerIcon";
import DribbbleIcon from "../DribbbleIcon";
import EnvelopeIcon from "../EnvelopeIcon";
import FigmaIcon from "../FigmaIcon";
import GitHubIcon from "../GitHubIcon";
import GitIcon from "../GitIcon";
import GooglePlusIcon from "../GooglePlusIcon";
import GraphQLIcon from "../GraphQLIcon";
import HerokuIcon from "../HerokuIcon";
import HTML5Icon from "../HTML5Icon";
import JavaScriptIcon from "../JavaScriptIcon";
import JenkinsIcon from "../JenkinsIcon";
import KafkaIcon from "../KafkaIcon";
import LiIcon from "../LiIcon";
import LinkedInIcon from "../LinkedInIcon";
import LinuxIcon from "../LinuxIcon";
import LogoIcon from "../LogoIcon";
import MicrosoftIcon from "../MicrosoftIcon";
import MongoIcon from "../MongoIcon";
import MoonIcon from "../MoonIcon";
import NextIcon from "../NextIcon";
import NodeIcon from "../NodeIcon";
import PinterestIcon from "../PinterestIcon";
import PostgresIcon from "../PostgresIcon";
import PulumiIcon from "../PulumiIcon";
import QuestionIcon from "../QuestionIcon";
import RailsIcon from "../RailsIcon";
import ReactIcon from "../ReactIcon";
import RedisIcon from "../RedisIcon";
import ReduxIcon from "../ReduxIcon";
import RSpecIcon from "../RSpecIcon";
import RubyIcon from "../RubyIcon";
import RustIcon from "../RustIcon";
import SASSIcon from "../SASSIcon";
import SolidityIcon from "../SolidityIcon";
import StorybookIcon from "../StorybookIcon";
import SunIcon from "../SunIcon";
import SvelteIcon from "../SvelteIcon";
import TailwindIcon from "../TailwindIcon";
import TelegramIcon from "../TelegramIcon";
import TerraformIcon from "../TerraformIcon";
import TwitterIcon from "../TwitterIcon";
import TypeScriptIcon from "../TypeScriptIcon";
import UnixIcon from "../UnixIcon";
import UserIcon from "../UserIcon";
import WhatsAppIcon from "../WhatsAppIcon";
import WWWIcon from "../WWWIcon";

// --- Icon registry ---

interface IconEntry {
  name: string;
  Component: ComponentType<any>;
  path: string;
  hasClassName: boolean;
  special?: "liicon" | "colored";
}

const ICONS: IconEntry[] = [
  {
    name: "ArrowIcon",
    Component: ArrowIcon,
    path: "@/atoms/icons/ArrowIcon",
    hasClassName: true,
  },
  {
    name: "AWSIcon",
    Component: AWSIcon,
    path: "@/atoms/icons/AWSIcon",
    hasClassName: false,
  },
  {
    name: "BashIcon",
    Component: BashIcon,
    path: "@/atoms/icons/BashIcon",
    hasClassName: false,
  },
  {
    name: "CalendarIcon",
    Component: CalendarIcon,
    path: "@/atoms/icons/CalendarIcon",
    hasClassName: true,
  },
  {
    name: "CalendlyIcon",
    Component: CalendlyIcon,
    path: "@/atoms/icons/CalendlyIcon",
    hasClassName: true,
  },
  {
    name: "CheckIcon",
    Component: CheckIcon,
    path: "@/atoms/icons/CheckIcon",
    hasClassName: true,
  },
  {
    name: "ChevronDownIcon",
    Component: ChevronDownIcon,
    path: "@/atoms/icons/ChevronDownIcon",
    hasClassName: true,
  },
  {
    name: "CopyIcon",
    Component: CopyIcon,
    path: "@/atoms/icons/CopyIcon",
    hasClassName: true,
  },
  {
    name: "CSS3Icon",
    Component: CSS3Icon,
    path: "@/atoms/icons/CSS3Icon",
    hasClassName: false,
  },
  {
    name: "CucumberIcon",
    Component: CucumberIcon,
    path: "@/atoms/icons/CucumberIcon",
    hasClassName: false,
  },
  {
    name: "DockerIcon",
    Component: DockerIcon,
    path: "@/atoms/icons/DockerIcon",
    hasClassName: false,
  },
  {
    name: "DribbbleIcon",
    Component: DribbbleIcon,
    path: "@/atoms/icons/DribbbleIcon",
    hasClassName: true,
  },
  {
    name: "EnvelopeIcon",
    Component: EnvelopeIcon,
    path: "@/atoms/icons/EnvelopeIcon",
    hasClassName: true,
  },
  {
    name: "FigmaIcon",
    Component: FigmaIcon,
    path: "@/atoms/icons/FigmaIcon",
    hasClassName: false,
  },
  {
    name: "GitHubIcon",
    Component: GitHubIcon,
    path: "@/atoms/icons/GitHubIcon",
    hasClassName: true,
  },
  {
    name: "GitIcon",
    Component: GitIcon,
    path: "@/atoms/icons/GitIcon",
    hasClassName: false,
  },
  {
    name: "GooglePlusIcon",
    Component: GooglePlusIcon,
    path: "@/atoms/icons/GooglePlusIcon",
    hasClassName: true,
    special: "colored",
  },
  {
    name: "GraphQLIcon",
    Component: GraphQLIcon,
    path: "@/atoms/icons/GraphQLIcon",
    hasClassName: false,
  },
  {
    name: "HerokuIcon",
    Component: HerokuIcon,
    path: "@/atoms/icons/HerokuIcon",
    hasClassName: false,
  },
  {
    name: "HTML5Icon",
    Component: HTML5Icon,
    path: "@/atoms/icons/HTML5Icon",
    hasClassName: false,
  },
  {
    name: "JavaScriptIcon",
    Component: JavaScriptIcon,
    path: "@/atoms/icons/JavaScriptIcon",
    hasClassName: false,
  },
  {
    name: "JenkinsIcon",
    Component: JenkinsIcon,
    path: "@/atoms/icons/JenkinsIcon",
    hasClassName: false,
  },
  {
    name: "KafkaIcon",
    Component: KafkaIcon,
    path: "@/atoms/icons/KafkaIcon",
    hasClassName: false,
  },
  {
    name: "LiIcon",
    Component: LiIcon,
    path: "@/atoms/icons/LiIcon",
    hasClassName: false,
    special: "liicon",
  },
  {
    name: "LinkedInIcon",
    Component: LinkedInIcon,
    path: "@/atoms/icons/LinkedInIcon",
    hasClassName: true,
    special: "colored",
  },
  {
    name: "LinuxIcon",
    Component: LinuxIcon,
    path: "@/atoms/icons/LinuxIcon",
    hasClassName: false,
  },
  {
    name: "LogoIcon",
    Component: LogoIcon,
    path: "@/atoms/icons/LogoIcon",
    hasClassName: true,
  },
  {
    name: "MicrosoftIcon",
    Component: MicrosoftIcon,
    path: "@/atoms/icons/MicrosoftIcon",
    hasClassName: false,
  },
  {
    name: "MongoIcon",
    Component: MongoIcon,
    path: "@/atoms/icons/MongoIcon",
    hasClassName: false,
  },
  {
    name: "MoonIcon",
    Component: MoonIcon,
    path: "@/atoms/icons/MoonIcon",
    hasClassName: true,
  },
  {
    name: "NextIcon",
    Component: NextIcon,
    path: "@/atoms/icons/NextIcon",
    hasClassName: false,
  },
  {
    name: "NodeIcon",
    Component: NodeIcon,
    path: "@/atoms/icons/NodeIcon",
    hasClassName: false,
  },
  {
    name: "PinterestIcon",
    Component: PinterestIcon,
    path: "@/atoms/icons/PinterestIcon",
    hasClassName: true,
  },
  {
    name: "PostgresIcon",
    Component: PostgresIcon,
    path: "@/atoms/icons/PostgresIcon",
    hasClassName: false,
  },
  {
    name: "PulumiIcon",
    Component: PulumiIcon,
    path: "@/atoms/icons/PulumiIcon",
    hasClassName: false,
  },
  {
    name: "QuestionIcon",
    Component: QuestionIcon,
    path: "@/atoms/icons/QuestionIcon",
    hasClassName: true,
  },
  {
    name: "RailsIcon",
    Component: RailsIcon,
    path: "@/atoms/icons/RailsIcon",
    hasClassName: false,
  },
  {
    name: "ReactIcon",
    Component: ReactIcon,
    path: "@/atoms/icons/ReactIcon",
    hasClassName: false,
  },
  {
    name: "RedisIcon",
    Component: RedisIcon,
    path: "@/atoms/icons/RedisIcon",
    hasClassName: false,
  },
  {
    name: "ReduxIcon",
    Component: ReduxIcon,
    path: "@/atoms/icons/ReduxIcon",
    hasClassName: false,
  },
  {
    name: "RSpecIcon",
    Component: RSpecIcon,
    path: "@/atoms/icons/RSpecIcon",
    hasClassName: false,
  },
  {
    name: "RubyIcon",
    Component: RubyIcon,
    path: "@/atoms/icons/RubyIcon",
    hasClassName: false,
  },
  {
    name: "RustIcon",
    Component: RustIcon,
    path: "@/atoms/icons/RustIcon",
    hasClassName: false,
  },
  {
    name: "SASSIcon",
    Component: SASSIcon,
    path: "@/atoms/icons/SASSIcon",
    hasClassName: false,
  },
  {
    name: "SolidityIcon",
    Component: SolidityIcon,
    path: "@/atoms/icons/SolidityIcon",
    hasClassName: false,
  },
  {
    name: "StorybookIcon",
    Component: StorybookIcon,
    path: "@/atoms/icons/StorybookIcon",
    hasClassName: false,
  },
  {
    name: "SunIcon",
    Component: SunIcon,
    path: "@/atoms/icons/SunIcon",
    hasClassName: true,
  },
  {
    name: "SvelteIcon",
    Component: SvelteIcon,
    path: "@/atoms/icons/SvelteIcon",
    hasClassName: false,
  },
  {
    name: "TailwindIcon",
    Component: TailwindIcon,
    path: "@/atoms/icons/TailwindIcon",
    hasClassName: false,
  },
  {
    name: "TelegramIcon",
    Component: TelegramIcon,
    path: "@/atoms/icons/TelegramIcon",
    hasClassName: true,
  },
  {
    name: "TerraformIcon",
    Component: TerraformIcon,
    path: "@/atoms/icons/TerraformIcon",
    hasClassName: false,
  },
  {
    name: "TwitterIcon",
    Component: TwitterIcon,
    path: "@/atoms/icons/TwitterIcon",
    hasClassName: true,
  },
  {
    name: "TypeScriptIcon",
    Component: TypeScriptIcon,
    path: "@/atoms/icons/TypeScriptIcon",
    hasClassName: false,
  },
  {
    name: "UnixIcon",
    Component: UnixIcon,
    path: "@/atoms/icons/UnixIcon",
    hasClassName: false,
  },
  {
    name: "UserIcon",
    Component: UserIcon,
    path: "@/atoms/icons/UserIcon",
    hasClassName: true,
  },
  {
    name: "WhatsAppIcon",
    Component: WhatsAppIcon,
    path: "@/atoms/icons/WhatsAppIcon",
    hasClassName: true,
  },
  {
    name: "WWWIcon",
    Component: WWWIcon,
    path: "@/atoms/icons/WWWIcon",
    hasClassName: false,
  },
];

// --- Size map ---

const SIZE_MAP: Record<number, string> = {
  16: "w-4 h-4",
  24: "w-6 h-6",
  32: "w-8 h-8",
  48: "w-12 h-12",
};

// --- LiIcon wrapper (needs ref for useScroll) ---

function LiIconWrapper({ size }: { size: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ width: size, height: size, margin: "0 auto" }}>
      <LiIcon reference={ref} />
    </div>
  );
}

// --- Gallery component ---

function IconGallery({ size, search }: { size: number; search: string }) {
  const filtered = ICONS.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  const sizeClass = SIZE_MAP[size] || "w-6 h-6";

  return (
    <div>
      <p
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 16,
        }}
      >
        {filtered.length} of {ICONS.length} icons
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map(({ name, Component, path, hasClassName, special }) => (
          <div
            key={name}
            style={{
              textAlign: "center",
              padding: "1rem 0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: size + 8,
              }}
            >
              {special === "liicon" ? (
                <LiIconWrapper size={size} />
              ) : hasClassName ? (
                <Component
                  className={sizeClass}
                  {...(special === "colored" ? { colored: false } : {})}
                />
              ) : (
                <svg
                  viewBox="0 0 128 128"
                  style={{ width: size, height: size }}
                >
                  <Component />
                </svg>
              )}
            </div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                marginTop: 8,
                marginBottom: 2,
                wordBreak: "break-word",
              }}
            >
              {name}
            </p>
            <code
              style={{
                fontSize: 9,
                color: "#888",
                display: "block",
                wordBreak: "break-all",
                lineHeight: 1.3,
              }}
            >
              {path}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Colored Icons variant ---

function ColoredIconsGallery({ size }: { size: number }) {
  const sizeClass = SIZE_MAP[size] || "w-6 h-6";
  const coloredIcons = ICONS.filter((i) => i.special === "colored");

  return (
    <div>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        {coloredIcons.length} icons with brand colors (colored=true)
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1rem",
        }}
      >
        {coloredIcons.map(({ name, Component, path }) => (
          <div
            key={name}
            style={{
              textAlign: "center",
              padding: "1rem 0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: size + 8,
              }}
            >
              <Component className={sizeClass} colored={true} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, marginTop: 8 }}>
              {name}
            </p>
            <code style={{ fontSize: 9, color: "#888" }}>{path}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Storybook meta ---

interface GalleryArgs {
  size: number;
  search: string;
}

const meta = {
  title: "Atoms/Icons/Gallery",
  tags: ["autodocs"],
  args: {
    size: 24,
    search: "",
  },
  argTypes: {
    size: {
      control: "radio",
      options: [16, 24, 32, 48],
      description: "Icon size in pixels",
    },
    search: {
      control: "text",
      description: "Filter icons by name",
    },
  },
} satisfies Meta<GalleryArgs>;

export default meta;
type Story = StoryObj<GalleryArgs>;

export const Default: Story = {
  render: (args: GalleryArgs) => (
    <IconGallery size={args.size} search={args.search} />
  ),
};

export const ColoredIcons: Story = {
  render: (args: GalleryArgs) => <ColoredIconsGallery size={args.size} />,
};
