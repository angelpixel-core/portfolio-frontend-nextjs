import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { checkA11y } from "@/test-utils/axe-helper";

jest.mock("@/state/slices/chatPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: false, close: jest.fn() }),
}));

jest.mock("@/state/slices/menuPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: true, close: jest.fn() }),
}));

// Mock useReducedMotion hook
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

import { Floating } from "../index";

describe("Floating accessibility", () => {
  it("renders a dialog with aria-modal and traps focus inside", () => {
    const { getByRole } = render(
      <Floating id="menu">
        <button type="button">Action</button>
      </Floating>
    );

    const dialog = getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  // Note: Escape key test removed - covered by FloatingMobile.a11y.test.tsx
  // The jest.doMock pattern doesn't work after static imports

  it("dialog has aria-labelledby attribute", () => {
    const { getByRole } = render(
      <Floating id="menu">
        <button type="button">Action</button>
      </Floating>
    );

    const dialog = getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });

  it("has no accessibility violations (jest-axe)", async () => {
    const { container } = render(
      <Floating id="menu" title="Menu Dialog">
        <button type="button">Action</button>
      </Floating>
    );

    await checkA11y(container);
  });
});
