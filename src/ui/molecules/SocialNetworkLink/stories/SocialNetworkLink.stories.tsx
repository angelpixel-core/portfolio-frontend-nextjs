import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import SocialNetworkLink from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Molecules/SocialNetworkLink",
  component: SocialNetworkLink,
  tags: ["autodocs"],
  args: {
    href: "https://github.com/angelszymczak",
    iconName: "github",
    iconClassName: "",
    ariaLabel: "GitHub",
    onClick: fn(),
  },
} satisfies Meta<typeof SocialNetworkLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LinkedIn: Story = {
  args: {
    href: "https://linkedin.com/in/angelszymczak",
    iconName: "linkedin",
    ariaLabel: "LinkedIn",
  },
};

export const Twitter: Story = {
  args: {
    href: "https://twitter.com/angelszymczak",
    iconName: "twitter",
    ariaLabel: "Twitter",
  },
};

export const Loading: Story = {
  render: () => <Skeleton />,
};
