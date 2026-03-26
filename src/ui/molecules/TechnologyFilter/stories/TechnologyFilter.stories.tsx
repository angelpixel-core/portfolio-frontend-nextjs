import type React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import TechnologyFilter from "../index";

const meta = {
  title: "Molecules/TechnologyFilter",
  component: TechnologyFilter,
  tags: ["autodocs"],
  decorators: [
    (Story: () => React.ReactElement) => (
      <div style={{ minWidth: 800 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Docker",
      "Next.js",
      "PostgreSQL",
    ],
    selected: [],
    onToggle: fn(),
    onClearAll: fn(),
  },
} satisfies Meta<typeof TechnologyFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    selected: ["React", "TypeScript"],
  },
};
