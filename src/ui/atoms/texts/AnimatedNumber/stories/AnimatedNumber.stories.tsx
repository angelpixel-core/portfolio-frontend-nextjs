import type { Meta, StoryObj } from "@storybook/react";

import AnimatedNumber from "../index";
import { AnimatedNumberSkeleton } from "../skeleton";

const meta = {
  title: "Atoms/Texts/AnimatedNumber",
  component: AnimatedNumber,
  tags: ["autodocs"],
  args: {
    value: 42,
  },
} satisfies Meta<typeof AnimatedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeValue: Story = {
  args: {
    value: 1500,
  },
};

export const Loading: Story = {
  render: () => <AnimatedNumberSkeleton />,
};
