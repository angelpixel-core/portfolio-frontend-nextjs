import type { Meta, StoryObj } from "@storybook/react";

import BaseLink from "../index";

const meta = {
  title: "Atoms/Links/BaseLink",
  component: BaseLink,
  tags: ["autodocs"],
  args: {
    href: "https://example.com",
    text: "Example Link",
  },
} satisfies Meta<typeof BaseLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InternalLink: Story = {
  args: {
    target: "_self",
    text: "Internal Link",
    href: "/about",
  },
};
