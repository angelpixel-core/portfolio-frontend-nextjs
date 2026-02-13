import type { Meta, StoryObj } from "@storybook/react";

import MenuButton from "../index";

const meta = {
  title: "Atoms/Buttons/MenuButton",
  component: MenuButton,
  tags: ["autodocs"],
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  parameters: {
    redux: {
      initialState: {
        menuPanel: { isOpen: true },
      },
    },
  },
};
