import { render, screen } from "@testing-library/react";
import RootProvider from "@/providers/RootProvider";
import HomePage from "../page";

describe("HomePage smoke test", () => {
  it("renders hero, CTAs and key sections without crashing", () => {
    render(
      <RootProvider>
        <HomePage />
      </RootProvider>
    );

    // Hero image container present
    expect(screen.getByRole("main")).toBeInTheDocument();

    // CTAs should render some variant of resume/contact
    expect(screen.getAllByText(/resume/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);

    // Key sections: Customers and HireMe should at least attach something to the DOM
    // We just assert that the render didn't throw and main exists; more detailed
    // assertions can be added later if needed.
  });
});
