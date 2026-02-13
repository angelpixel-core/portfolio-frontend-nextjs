import type { Meta, StoryObj } from "@storybook/react";

import AuthButton from "../index";

const meta = {
  title: "Atoms/Buttons/AuthButton",
  component: AuthButton,
  tags: ["autodocs"],
} satisfies Meta<typeof AuthButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Authenticated: Story = {
  parameters: {
    redux: {
      initialState: {
        authPanel: {
          isOpen: false,
          isAuthenticated: true,
          user: { name: "Test User", email: "test@example.com" },
          error: null,
        },
      },
    },
  },
};

export const PanelOpen: Story = {
  parameters: {
    redux: {
      initialState: {
        authPanel: {
          isOpen: true,
          isAuthenticated: false,
          user: null,
          error: null,
        },
      },
    },
  },
};
