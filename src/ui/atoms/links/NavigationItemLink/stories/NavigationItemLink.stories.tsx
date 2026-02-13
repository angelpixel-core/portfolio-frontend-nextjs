import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import NavigationItemLink from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Atoms/Links/NavigationItemLink",
  component: NavigationItemLink,
  tags: ["autodocs"],
  args: {
    href: "/about",
    name: "About",
    onClick: fn(),
  },
} satisfies Meta<typeof NavigationItemLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Projects: Story = {
  args: {
    ...meta.args,
    href: "/projects",
    name: "Projects",
  },
};

export const Loading: Story = {
  render: () => <Skeleton />,
};
