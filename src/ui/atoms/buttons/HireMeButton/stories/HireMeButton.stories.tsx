import type { Meta, StoryObj } from "@storybook/react";

import HireMeButton from "../index";

const meta = {
  title: "Atoms/Buttons/HireMeButton",
  component: HireMeButton,
  tags: ["autodocs"],
} satisfies Meta<typeof HireMeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
