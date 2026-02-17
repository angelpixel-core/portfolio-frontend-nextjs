import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Every Layout Primitives — CSS utility classes for composable layouts.
 *
 * Defined in `src/styles/globals.css` inside `@layer utilities`.
 * Compose with Tailwind spacing (`gap-*`), sizing (`max-w-*`),
 * and breakpoint modifiers (`tablet:`, `desktop:`).
 *
 * ADRs: 008 (spacing), 009 (containment), 010 (layout/component)
 */

const Box = ({
  children,
  label,
}: {
  children?: React.ReactNode;
  label?: string;
}) => (
  <div className="rounded border border-dark/20 bg-primary/10 p-4 text-sm dark:border-light/20 dark:bg-primary/20">
    {label ?? children}
  </div>
);

const meta = {
  title: "Atoms/Layout/LayoutPrimitives",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Vertical flow container. Compose with `gap-*` for spacing. */
export const Stack: Story = {
  render: () => (
    <div className="stack gap-4" style={{ maxWidth: 400 }}>
      <Box label="Item 1 (gap-4)" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </div>
  ),
};

/** Stack with tighter spacing (gap-2 = 8px). */
export const StackTight: Story = {
  name: "Stack — Tight (gap-2)",
  render: () => (
    <div className="stack gap-2" style={{ maxWidth: 400 }}>
      <Box label="Item 1 (gap-2)" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </div>
  ),
};

/** Stack with loose spacing (gap-8 = 32px). */
export const StackLoose: Story = {
  name: "Stack — Loose (gap-8)",
  render: () => (
    <div className="stack gap-8" style={{ maxWidth: 400 }}>
      <Box label="Item 1 (gap-8)" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </div>
  ),
};

/** Horizontally centered container. Always combine with `max-w-*`. */
export const Center: Story = {
  render: () => (
    <div>
      <div className="center max-w-md rounded border-2 border-dashed border-primary/40 p-6">
        <p className="text-center text-sm">
          Centered content (max-w-md = 448px)
        </p>
      </div>
    </div>
  ),
};

/** Center with larger max-width. */
export const CenterWide: Story = {
  name: "Center — Wide (max-w-4xl)",
  render: () => (
    <div>
      <div className="center max-w-4xl rounded border-2 border-dashed border-primary/40 p-6">
        <p className="text-center text-sm">
          Centered content (max-w-4xl = 896px)
        </p>
      </div>
    </div>
  ),
};

/** Wrapping horizontal flow. Items wrap to next line when container is full. */
export const Cluster: Story = {
  render: () => (
    <div className="cluster gap-2 items-center" style={{ maxWidth: 400 }}>
      {["React", "TypeScript", "Next.js", "Tailwind", "Jest", "Playwright"].map(
        (tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/20 px-3 py-1 text-xs dark:bg-primary/30"
          >
            {tag}
          </span>
        )
      )}
    </div>
  ),
};

/** Asymmetric two-column grid. Customize via CSS custom properties. */
export const Sidebar: Story = {
  render: () => (
    <div
      className="sidebar"
      style={
        {
          "--sidebar-main": "5fr",
          "--sidebar-aside": "3fr",
          "--sidebar-gap": "1.5rem",
        } as React.CSSProperties
      }
    >
      <div className="rounded border border-dark/20 bg-primary/10 p-4 dark:border-light/20">
        <p className="text-sm font-medium">Main (5fr)</p>
        <p className="text-xs opacity-70">Biography content area</p>
      </div>
      <div className="rounded border border-dark/20 bg-primary/10 p-4 dark:border-light/20">
        <p className="text-sm font-medium">Aside (3fr)</p>
        <p className="text-xs opacity-70">Hero image area</p>
      </div>
    </div>
  ),
};

/** Sidebar with equal split columns. */
export const SidebarEqual: Story = {
  name: "Sidebar — Equal Split",
  render: () => (
    <div
      className="sidebar"
      style={
        {
          "--sidebar-main": "1fr",
          "--sidebar-aside": "1fr",
        } as React.CSSProperties
      }
    >
      <div className="rounded border border-dark/20 bg-primary/10 p-4 dark:border-light/20">
        <p className="text-sm font-medium">Left (1fr)</p>
      </div>
      <div className="rounded border border-dark/20 bg-primary/10 p-4 dark:border-light/20">
        <p className="text-sm font-medium">Right (1fr)</p>
      </div>
    </div>
  ),
};

/** Mobile-first column that switches to row at breakpoint. */
export const Switcher: Story = {
  render: () => (
    <div className="switcher gap-4 tablet:flex-row">
      <Box label="Column on mobile, row on tablet+" />
      <Box label="Resize viewport to see switch" />
      <Box label="Third item" />
    </div>
  ),
};

/**
 * Full-height container with principal child that grows,
 * pushing header to top and footer to bottom.
 */
export const Cover: Story = {
  render: () => (
    <div className="cover" style={{ minHeight: "400px", maxWidth: 600 }}>
      <div className="rounded-t border border-dark/20 bg-primary/20 p-3 text-center text-sm dark:border-light/20">
        Header (fixed)
      </div>
      <div className="cover-principal rounded border border-dark/20 bg-primary/5 p-4 text-center text-sm dark:border-light/20">
        Principal — grows to fill available space (flex: 1)
      </div>
      <div className="rounded-b border border-dark/20 bg-primary/20 p-3 text-center text-sm dark:border-light/20">
        Footer (pushed to bottom)
      </div>
    </div>
  ),
};

/** Auto-responsive grid that fills available columns based on --min width. */
export const GridFluid: Story = {
  name: "Grid Fluid",
  render: () => (
    <div
      className="grid-fluid gap-4"
      style={{ "--min": "200px" } as React.CSSProperties}
    >
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} label={`Card ${i + 1}`} />
      ))}
    </div>
  ),
};

/** Grid Fluid with wider minimum column width. */
export const GridFluidWide: Story = {
  name: "Grid Fluid — Wide (--min: 320px)",
  render: () => (
    <div
      className="grid-fluid gap-8"
      style={{ "--min": "320px" } as React.CSSProperties}
    >
      {Array.from({ length: 4 }, (_, i) => (
        <Box key={i} label={`Project ${i + 1}`} />
      ))}
    </div>
  ),
};
