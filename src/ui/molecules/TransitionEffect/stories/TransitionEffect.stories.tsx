import type { Meta, StoryObj } from "@storybook/react";

import TransitionEffect from "../index";

/**
 * TransitionEffect renders page transition curtains driven by TransitionProvider context.
 *
 * Limitation: Without an active transition (phase !== "idle"), this component renders null.
 * The curtain layers (pink/white/dark) are only visible during navigation transitions.
 * This story documents the component API; visual testing requires triggering a route change.
 */
const meta = {
  title: "Molecules/TransitionEffect",
  component: TransitionEffect,
  tags: ["autodocs"],
  decorators: [
    (Story: () => JSX.Element) => (
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransitionEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
