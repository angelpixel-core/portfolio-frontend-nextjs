import type { Meta, StoryObj } from "@storybook/react";

import CircularText from "../index";

const meta = {
  title: "Atoms/Texts/CircularText",
  component: CircularText,
  tags: ["autodocs"],
  args: {
    fillSvgColor: "",
  },
  decorators: [
    (Story: any) => (
      <div style={{ width: 200, height: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CircularText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
