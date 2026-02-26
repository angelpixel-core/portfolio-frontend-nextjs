import type { Meta, StoryObj } from "@storybook/react";

import AnimatedTitle from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Atoms/Texts/AnimatedTitle",
  component: AnimatedTitle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "AnimatedTitle now renders a single animated heading element (no per-word split spans), preserving transition gating and reduced-motion behavior.",
      },
    },
  },
} satisfies Meta<typeof AnimatedTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
