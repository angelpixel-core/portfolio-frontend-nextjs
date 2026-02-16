import type { Meta, StoryObj } from "@storybook/react";

import Experience from "../index";
import { Skeleton } from "../skeleton";

const sampleExperience = {
  id: 1,
  position: "Senior Frontend Engineer",
  company: "Acme Corp",
  companyLink: "https://acme.example.com",
  time: "Jan 2023 - Present",
  address: "Buenos Aires, Argentina",
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
    time: sampleExperience.time,
    address: sampleExperience.address,
    work: sampleExperience.work,
  },
} satisfies Meta<typeof Experience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTags: Story = {
  args: {
    work: [
      {
        description: "Led migration from CRA to Next.js App Router",
        tags: ["React", "Next.js"],
      },
      {
        description: "Implemented design system with Atomic Design methodology",
        tags: ["Design System", "CSS"],
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
