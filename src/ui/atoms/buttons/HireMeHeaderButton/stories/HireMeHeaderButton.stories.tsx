import type { Meta, StoryObj } from "@storybook/react";

import HireMeHeaderButton from "../index";

const meta = {
  title: "Atoms/Buttons/HireMeHeaderButton",
  component: HireMeHeaderButton,
  tags: ["autodocs"],
} satisfies Meta<typeof HireMeHeaderButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
