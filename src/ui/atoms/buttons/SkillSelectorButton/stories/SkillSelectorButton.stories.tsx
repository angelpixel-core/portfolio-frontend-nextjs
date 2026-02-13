import type { Meta, StoryObj } from "@storybook/react";

import SkillSelectorButton from "../index";

const meta = {
  title: "Atoms/Buttons/SkillSelectorButton",
  component: SkillSelectorButton,
  tags: ["autodocs"],
  args: {
    category: "senior",
    text: "Senior",
  },
} satisfies Meta<typeof SkillSelectorButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Middle: Story = {
  args: {
    category: "middle",
    text: "Middle",
  },
};

export const Junior: Story = {
  args: {
    category: "junior",
    text: "Junior",
  },
};
