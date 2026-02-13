import type { Meta, StoryObj } from "@storybook/react";

import CopyEmail from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Molecules/CopyEmail",
  component: CopyEmail,
  tags: ["autodocs"],
} satisfies Meta<typeof CopyEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
