"use client";

import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface OverlayPortalProps {
  children: ReactNode;
}

const OverlayPortal = ({ children }: OverlayPortalProps): ReactNode => {
  if (typeof document === "undefined") return null;

  return createPortal(children, document.body);
};

export default OverlayPortal;
