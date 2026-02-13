import type { Meta, StoryObj } from "@storybook/react";

import NavigationItemButton from "@/buttons/NavigationItemButton";
import { NavigationItemButtonsSkeleton } from "../skeleton";

/**
 * NavigationItems is an async server component that cannot render directly in Storybook.
 * This story renders the underlying NavigationItemButton atoms with mock data instead,
 * mirroring what the server component produces.
 */

const NavigationItemsPreview = () => (
  <nav style={{ display: "flex", gap: 8 }}>
    <NavigationItemButton href="/" name="Home" />
    <NavigationItemButton href="/about" name="About" />
    <NavigationItemButton href="/projects" name="Projects" />
    <NavigationItemButton href="/articles" name="Articles" />
  </nav>
);

const meta = {
  title: "Molecules/NavigationItems",
  component: NavigationItemsPreview,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationItemsPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => (
    <nav style={{ display: "flex", gap: 8 }}>
      <NavigationItemButtonsSkeleton />
    </nav>
  ),
};
