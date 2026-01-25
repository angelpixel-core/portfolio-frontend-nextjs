import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Article detail layout - inherits from parent articles layout
 * This is a minimal layout that passes through to the parent
 */
export default function ArticleDetailLayout({
  children,
}: LayoutProps): React.JSX.Element {
  return <>{children}</>;
}
