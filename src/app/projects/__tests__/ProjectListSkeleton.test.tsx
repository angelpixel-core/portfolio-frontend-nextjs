import { render, screen } from "@testing-library/react";
import ProjectListSkeleton from "../ProjectListSkeleton";

describe("ProjectListSkeleton", () => {
  it("renders skeleton cards without crashing", () => {
    const { container } = render(<ProjectListSkeleton />);

    expect(screen.getByTestId("projects-skeleton")).toBeInTheDocument();
    expect(container.querySelectorAll(".project-card--featured")).toHaveLength(
      2
    );
    expect(container.querySelectorAll(".project-card--grid")).toHaveLength(4);
  });
});
