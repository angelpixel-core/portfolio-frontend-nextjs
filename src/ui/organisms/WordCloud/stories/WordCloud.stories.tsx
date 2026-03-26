import type { Meta, StoryObj } from "@storybook/react";

import WordCloud from "../index";

/**
 * WordCloud renders a 3D spherical tag cloud using TagCloud.js (dynamically imported).
 *
 * The component uses internal data from `data.js` — no external mock needed.
 * Clicking a word opens a SkillDetail overlay (lazy loaded with AnimatePresence).
 * The TagCloud library renders asynchronously, so the sphere may take a moment to appear.
 */
const meta = {
  title: "Organisms/WordCloud",
  component: WordCloud,
  tags: ["autodocs"],
  decorators: [
    (Story: () => JSX.Element) => (
      <div style={{ minHeight: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WordCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
