import type React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import HireMe from "../index";

const meta = {
  title: "Molecules/HireMe",
  component: HireMe,
  tags: ["autodocs"],
  decorators: [
    (Story: () => React.ReactElement) => (
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HireMe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
