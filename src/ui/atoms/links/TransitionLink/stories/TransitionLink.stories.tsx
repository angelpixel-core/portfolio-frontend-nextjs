import type { Meta, StoryObj } from "@storybook/react";

import TransitionLink from "../index";

const meta = {
  title: "Atoms/Links/TransitionLink",
  component: TransitionLink,
  tags: ["autodocs"],
  args: {
    href: "/about",
    children: "About",
  },
} satisfies Meta<typeof TransitionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: {
    href: "https://github.com",
    children: "GitHub",
  },
};
