import type { Meta, StoryObj } from "@storybook/react";

import ArrowButton from "../index";

const meta = {
  title: "Atoms/Buttons/ArrowButton",
  component: ArrowButton,
  tags: ["autodocs"],
  args: {
    href: "/about",
    text: "Learn More",
  },
} satisfies Meta<typeof ArrowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExternalLink: Story = {
  args: {
    href: "https://github.com",
    text: "View Repository",
    target: "_blank",
  },
};

export const InternalLink: Story = {
  args: {
    href: "/projects",
    text: "View Projects",
    target: "_self",
  },
};
