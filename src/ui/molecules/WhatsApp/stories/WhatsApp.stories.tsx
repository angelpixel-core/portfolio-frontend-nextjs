import type { Meta, StoryObj } from "@storybook/react";

import WhatsApp from "../index";
import Skeleton from "../skeleton";

const meta = {
  title: "Molecules/WhatsApp",
  component: WhatsApp,
  tags: ["autodocs"],
  args: {
    text: "whatsapp",
  },
} satisfies Meta<typeof WhatsApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <Skeleton />,
};
