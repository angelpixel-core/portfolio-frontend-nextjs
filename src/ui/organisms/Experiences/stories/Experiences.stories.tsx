import type { Meta, StoryObj } from "@storybook/react";

import Experiences from "../index";
import { Skeleton } from "../skeleton";

const meta = {
  title: "Organisms/Experiences",
  component: Experiences,
  tags: ["autodocs"],
} satisfies Meta<typeof Experiences>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
