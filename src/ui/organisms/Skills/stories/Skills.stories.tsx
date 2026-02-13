import type { Meta, StoryObj } from "@storybook/react";

import Skills from "../index";
import { SkillsListSkeleton } from "../skeleton";

const meta = {
  title: "Organisms/Skills",
  component: Skills,
  tags: ["autodocs"],
} satisfies Meta<typeof Skills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <SkillsListSkeleton />,
};
