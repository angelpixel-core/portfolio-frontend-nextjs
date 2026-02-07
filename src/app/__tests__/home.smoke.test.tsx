import { render, screen } from "@testing-library/react";
import RootProvider from "@/providers/RootProvider";
import HomePage from "../page";

// Mock useProfile to provide calendar data for Calendar component
jest.mock("@/domains/profile/queries", () => ({
  useProfile: () => ({
    data: {
      calendly: "https://calendly.com/test",
    },
    isLoading: false,
    isError: false,
  }),
}));

describe("HomePage smoke test", () => {
  it("renders hero, CTAs and key sections without crashing", () => {
    render(
      <RootProvider>
        <HomePage />
      </RootProvider>
    );

    // Note: <main> element is in layout.jsx, not in page.tsx
    // This test renders only the page component, so we validate CTAs instead

    // Resume button should render with text
    expect(screen.getAllByText(/resume/i).length).toBeGreaterThan(0);

    // Calendar link should render (contact is in aria-label, not visible text)
    expect(screen.getByTestId("contact-calendly-link")).toBeInTheDocument();

    // Hero blade should be present
    expect(screen.getByTestId("home-hero-blade")).toBeInTheDocument();
  });
});
