import type { Meta, StoryObj } from "@storybook/react";

import CalendarLink from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Atoms/Links/CalendarLink",
  component: CalendarLink,
  tags: ["autodocs"],
  args: {
    href: "https://calendly.com/test",
  },
} satisfies Meta<typeof CalendarLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
