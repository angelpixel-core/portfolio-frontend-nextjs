import type { Meta, StoryObj } from "@storybook/react";

import ChatButton from "../index";

const meta = {
  title: "Atoms/Buttons/ChatButton",
  component: ChatButton,
  tags: ["autodocs"],
} satisfies Meta<typeof ChatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  parameters: {
    redux: {
      initialState: {
        chatPanel: { isOpen: true },
      },
    },
  },
};
