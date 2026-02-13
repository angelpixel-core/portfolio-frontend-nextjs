import type { Meta, StoryObj } from "@storybook/react";

import Calendar from "../index";
import Skeleton from "@/links/CalendarLink/skeleton";

const meta = {
  title: "Molecules/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: {
    className: "",
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
