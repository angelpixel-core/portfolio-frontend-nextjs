import { render, screen, fireEvent } from "@testing-library/react";
import SkillSelectorButton from "../index";

describe("SkillSelectorButton", () => {
  it("toggles aria-pressed and active class on click", () => {
    render(<SkillSelectorButton category="senior" text="5 años" />);

    const button = screen.getByRole("button", { name: /5 años/i });

    // Initial state
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveClass("skills_selector-button--active");

    // After click
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("skills_selector-button--active");
  });
});
