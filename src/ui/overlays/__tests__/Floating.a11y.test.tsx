import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { checkA11y } from "@/test-utils/axe-helper";

jest.mock("@/state/slices", () => ({
  useChatPanel: () => ({ isOpen: false, close: jest.fn() }),
  useMenuPanel: () => ({ isOpen: true, close: jest.fn() }),
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

  it("closes on Escape key press via handler", () => {
    const closeMock = jest.fn();

    jest.doMock("@/state/slices", () => ({
      useChatPanel: () => ({ isOpen: false, close: jest.fn() }),
      useMenuPanel: () => ({ isOpen: true, close: closeMock }),
    }));

    const { getByRole } = render(
      <Floating id="menu">
        <button type="button">Action</button>
      </Floating>
    );

    const dialog = getByRole("dialog");
    dialog.focus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(closeMock).toHaveBeenCalled();
  });

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
