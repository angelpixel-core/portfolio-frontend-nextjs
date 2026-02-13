import type { Meta, StoryObj } from "@storybook/react";

import Biography from "../index";
import { BiographySkeleton } from "../skeletons";

const meta = {
  title: "Organisms/Biography",
  component: Biography,
  tags: ["autodocs"],
} satisfies Meta<typeof Biography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTitle: Story = {
  args: {
    showTitle: true,
  },
};

export const Loading: Story = {
  render: () => <BiographySkeleton />,
};
