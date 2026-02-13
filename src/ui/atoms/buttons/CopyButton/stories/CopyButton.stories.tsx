import type { Meta, StoryObj } from "@storybook/react";

import CopyButton from "../index";

const meta = {
  title: "Atoms/Buttons/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Copied: Story = {
  parameters: {
    redux: {
      initialState: {
        emailClipboard: { isCopied: true, error: null },
      },
    },
  },
};
