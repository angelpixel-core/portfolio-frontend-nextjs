import type { Meta, StoryObj } from "@storybook/react";

import ImageLink from "../index";
import { ImageLinkSkeleton } from "../skeleton";

const meta = {
  title: "Atoms/Links/ImageLink",
  component: ImageLink,
  tags: ["autodocs"],
  args: {
    href: "/",
    src: "/images/profile/hero.png",
    alt: "Profile",
    size: 200,
  },
} satisfies Meta<typeof ImageLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <ImageLinkSkeleton size={200} />,
};
