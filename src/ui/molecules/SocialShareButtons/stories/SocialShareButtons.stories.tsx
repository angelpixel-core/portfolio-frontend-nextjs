import type { Meta, StoryObj } from "@storybook/react";

import SocialShareButtons from "../index";

const meta = {
  title: "Molecules/SocialShareButtons",
  component: SocialShareButtons,
  tags: ["autodocs"],
  args: {
    url: "https://example.com/articles/react-pagination",
    title: "Build A Custom Pagination Component In ReactJS From Scratch",
  },
} satisfies Meta<typeof SocialShareButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
