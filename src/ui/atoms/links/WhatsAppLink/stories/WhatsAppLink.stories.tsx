import type { Meta, StoryObj } from "@storybook/react";

import WhatsAppLink from "../index";

const meta = {
  title: "Atoms/Links/WhatsAppLink",
  component: WhatsAppLink,
  tags: ["autodocs"],
  args: {
    href: "https://wa.me/123456789",
    text: "WhatsApp",
  },
} satisfies Meta<typeof WhatsAppLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
