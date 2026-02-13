import type { Meta, StoryObj } from "@storybook/react";

import Academics from "../index";
import { AcademicsSkeleton } from "../skeleton";

const meta = {
  title: "Organisms/Academics",
  component: Academics,
  tags: ["autodocs"],
} satisfies Meta<typeof Academics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <AcademicsSkeleton />,
};
