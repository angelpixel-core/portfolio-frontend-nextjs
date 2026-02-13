import type { Meta, StoryObj } from "@storybook/react";

import ParagraphText from "../index";
import { ParagraphSkeleton } from "../skeleton";

const meta = {
  title: "Atoms/Texts/ParagraphText",
  component: ParagraphText,
  tags: ["autodocs"],
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
} satisfies Meta<typeof ParagraphText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <ParagraphSkeleton />,
};
