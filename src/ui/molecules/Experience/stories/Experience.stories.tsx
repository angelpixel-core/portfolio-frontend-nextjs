import type { Meta, StoryObj } from "@storybook/react";

import Experience from "../index";
import { Skeleton } from "../skeleton";

const sampleExperience = {
  id: 1,
  position: "Senior Frontend Engineer",
  company: "Acme Corp",
  companyLink: "https://acme.example.com",
  time: "Jan 2023 - Present",
  year: "2023",
  address: "Buenos Aires, Argentina",
  contextBadges: ["Product Engineering", "Remote", "B2B"],
  technologies: ["TypeScript", "React", "Next.js", "Jest"],
  work: [
    { description: "Led migration from CRA to Next.js App Router" },
    { description: "Implemented design system with Atomic Design methodology" },
    {
      description:
        "Reduced bundle size by 40% through tree-shaking optimizations",
    },
  ],
};

const meta = {
  title: "Molecules/Experience",
  component: Experience,
  tags: ["autodocs"],
  args: {
    id: sampleExperience.id,
    position: sampleExperience.position,
    company: sampleExperience.company,
    companyLink: sampleExperience.companyLink,
    year: sampleExperience.year,
    address: sampleExperience.address,
    contextBadges: sampleExperience.contextBadges,
    technologies: sampleExperience.technologies,
    work: sampleExperience.work,
  },
} satisfies Meta<typeof Experience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithWorkTagsIgnoredForTechnologies: Story = {
  args: {
    technologies: ["TypeScript", "React"],
    work: [
      {
        description: "Led migration from CRA to Next.js App Router",
        tags: ["Ignored-Tag", "Next.js"],
      },
      {
        description: "Implemented design system with Atomic Design methodology",
        tags: ["Also-Ignored"],
      },
    ],
  },
};

export const EmptyContextBadges: Story = {
  args: {
    contextBadges: [],
  },
};

export const EmptyTechnologies: Story = {
  args: {
    technologies: [],
    work: [
      {
        description:
          "Maintained feature delivery while tags remain detail-only",
        tags: ["ShouldNotRenderAsTechnology"],
      },
    ],
  },
};

export const WithoutTasks: Story = {
  args: {
    work: [],
  },
};

export const Loading: Story = {
  render: () => <Skeleton />,
};
