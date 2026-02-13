import type { Meta, StoryObj } from "@storybook/react";

import Hiring from "../index";
import { Skeleton } from "../skeleton";

const meta = {
  title: "Organisms/Hiring",
  component: Hiring,
  tags: ["autodocs"],
} satisfies Meta<typeof Hiring>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
