import type { Meta, StoryObj } from "@storybook/react";

import ExperienceStats from "../index";
import { ExtraInfoListSkeleton } from "../skeleton";

const meta = {
  title: "Organisms/ExperienceStats",
  component: ExperienceStats,
  tags: ["autodocs"],
} satisfies Meta<typeof ExperienceStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <ExtraInfoListSkeleton />,
};
