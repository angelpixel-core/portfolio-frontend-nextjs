import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { checkA11y } from "@/test-utils/axe-helper";

jest.mock("@/state/slices/chatPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: false, closeChatPanel: jest.fn() }),
}));

jest.mock("@/state/slices/menuPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: true, closeMenuPanel: jest.fn() }),
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

  it("routes Escape close through explicit onRequestClose callback", () => {
    const onRequestClose = jest.fn();

    render(
      <Floating id="project-architecture" onRequestClose={onRequestClose}>
        <button type="button">Action</button>
      </Floating>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it("routes outside click close through explicit onRequestClose callback", () => {
    const onRequestClose = jest.fn();

    const { getByRole } = render(
      <Floating id="project-architecture" onRequestClose={onRequestClose}>
        <button type="button">Action</button>
      </Floating>
    );

    fireEvent.click(getByRole("dialog"));
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it("keeps custom close controls compatible with explicit callback", () => {
    const onRequestClose = jest.fn();

    const { getByRole } = render(
      <Floating id="project-architecture" onRequestClose={onRequestClose}>
        <button type="button" onClick={onRequestClose}>
          Close overlay
        </button>
      </Floating>
    );

    fireEvent.click(getByRole("button", { name: "Close overlay" }));
    expect(onRequestClose).toHaveBeenCalledTimes(1);
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
