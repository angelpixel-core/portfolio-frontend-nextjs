import type { Meta, StoryObj } from "@storybook/react";

import ActiveMarkFloating from "../index";

const meta = {
  title: "Atoms/Texts/ActiveMarkFloating",
  component: ActiveMarkFloating,
  tags: ["autodocs"],
  args: {
    activePath: "/",
  },
} satisfies Meta<typeof ActiveMarkFloating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Inactive: Story = {
  args: {
    activePath: "/nonexistent",
  },
};
