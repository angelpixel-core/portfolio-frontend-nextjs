"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

import { useTransition } from "@/hooks";

type LinkProps = ComponentProps<typeof Link>;

export interface TransitionLinkProps extends Omit<LinkProps, "onClick"> {
  /** Optional additional onClick handler (called after transition starts) */
  onClick?: (_e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * TransitionLink - Link component that triggers page transitions via TransitionProvider
 *
 * Wraps Next.js Link to intercept clicks and use startTransition() instead of
 * direct navigation. This enables coordinated page transitions with animations.
 *
 * Edge cases handled:
 * - Same page navigation: No transition, stays on page
 * - External URLs: Normal link behavior (no transition)
 * - Cmd+Click / Ctrl+Click: Opens in new tab (no transition)
 * - Middle click: Opens in new tab (no transition)
 * - Already transitioning: Ignores click
 *
 * @example
 * ```tsx
 * <TransitionLink href="/about" className="nav-link">
 *   About
 * </TransitionLink>
 * ```
 */
const TransitionLink = ({
  href,
  children,
  onClick,
  ...props
}: TransitionLinkProps) => {
  const pathname = usePathname();
  const { startTransition, isTransitioning } = useTransition();

  /**
   * Determine if href is an external URL
   */
  const isExternalUrl = (url: string | object): boolean => {
    if (typeof url !== "string") return false;
    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("//")
    );
  };

  /**
   * Determine if href points to the current page
   */
  const isSamePage = (url: string | object): boolean => {
    if (typeof url !== "string") return false;
    // Normalize paths (remove trailing slashes, handle root)
    const normalizedHref = url === "/" ? "/" : url.replace(/\/$/, "");
    const normalizedPathname =
      pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    return normalizedHref === normalizedPathname;
  };

  /**
   * Handle click events - intercept for internal navigation
   */
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const hrefString = typeof href === "string" ? href : href.pathname || "";

    // Let external URLs behave normally
    if (isExternalUrl(href)) {
      onClick?.(e);
      return;
    }

    // Let same-page navigation behave normally (no transition needed)
    if (isSamePage(href)) {
      onClick?.(e);
      return;
    }

    // Allow cmd+click, ctrl+click, middle click to open in new tab
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      onClick?.(e);
      return;
    }

    // Ignore if already transitioning
    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    // Prevent default navigation and use transition system
    e.preventDefault();

    // Call optional onClick handler
    onClick?.(e);

    // Start the transition
    startTransition(hrefString);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
