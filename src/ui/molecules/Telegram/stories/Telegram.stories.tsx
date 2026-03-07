import type { Meta, StoryObj } from "@storybook/react";

import Telegram from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Molecules/Telegram",
  component: Telegram,
  tags: ["autodocs"],
  args: {
    text: "telegram",
  },
} satisfies Meta<typeof Telegram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
