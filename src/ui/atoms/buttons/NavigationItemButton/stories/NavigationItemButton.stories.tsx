import type { Meta, StoryObj } from "@storybook/react";

import NavigationItemButton from "../index";

const meta = {
  title: "Atoms/Buttons/NavigationItemButton",
  component: NavigationItemButton,
  tags: ["autodocs"],
  args: {
    href: "/about",
    name: "About",
  },
} satisfies Meta<typeof NavigationItemButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Projects: Story = {
  args: {
    href: "/projects",
    name: "Projects",
  },
};
