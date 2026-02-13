import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import NeumorphicToggle from "../index";

const meta = {
  title: "Atoms/Buttons/NeumorphicToggle",
  component: NeumorphicToggle,
  tags: ["autodocs"],
  args: {
    id: "toggle-1",
    label: "Filter",
    isPressed: false,
    onToggle: fn(),
  },
} satisfies Meta<typeof NeumorphicToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = {
  args: {
    isPressed: true,
  },
};
