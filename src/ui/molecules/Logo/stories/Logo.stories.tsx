import type { Meta, StoryObj } from "@storybook/react";

import Logo from "../index";

const meta = {
  title: "Molecules/Logo",
  component: Logo,
  tags: ["autodocs"],
  decorators: [
    (Story: any) => (
      <div style={{ width: 200, height: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
