import type { Meta, StoryObj } from "@storybook/react";

import ThemeButton from "../index";

const meta = {
  title: "Atoms/Buttons/ThemeButton",
  component: ThemeButton,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  parameters: {
    redux: {
      initialState: {
        themeMode: { mode: "dark" },
      },
    },
  },
};

export const LightMode: Story = {
  parameters: {
    redux: {
      initialState: {
        themeMode: { mode: "light" },
      },
    },
  },
};
