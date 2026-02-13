import type { Meta, StoryObj } from "@storybook/react";

import NavigationItemButton from "../index";
import Skeleton from "../skeleton";

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

export const Loading: Story = {
  render: () => <Skeleton />,
};
