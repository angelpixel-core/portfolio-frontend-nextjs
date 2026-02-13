import type { Meta, StoryObj } from "@storybook/react";

import ActiveMark from "../index";

const meta = {
  title: "Atoms/Texts/ActiveMark",
  component: ActiveMark,
  tags: ["autodocs"],
  args: {
    activePath: "/",
  },
} satisfies Meta<typeof ActiveMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Inactive: Story = {
  args: {
    activePath: "/nonexistent",
  },
};
