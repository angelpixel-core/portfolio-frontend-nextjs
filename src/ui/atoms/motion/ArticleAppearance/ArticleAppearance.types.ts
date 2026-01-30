import type { ReactNode } from "react";

/**
 * Props for ArticleAppearance component
 */
export interface ArticleAppearanceProps {
  /** Unique identifier for this item (used for visibility tracking) */
  id: string;
  /** Content to animate */
  children: ReactNode;
  /** Optional CSS class name */
  className?: string;
  /** Optional delay before animation starts (in seconds) */
  delay?: number;
  /** Optional index for stagger calculation */
  index?: number;
}
