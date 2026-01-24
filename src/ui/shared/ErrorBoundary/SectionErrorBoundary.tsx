"use client";

import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[SectionErrorBoundary] Error in ${this.props.sectionName}:`,
      error,
      errorInfo
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20"
        >
          <p className="text-red-800 dark:text-red-200">
            Sorry, there was an error loading the {this.props.sectionName}{" "}
            section.
          </p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
