import { render } from "@testing-library/react";
import ProjectListSkeleton from "../ProjectListSkeleton";

describe("ProjectListSkeleton", () => {
  it("renders skeleton cards without crashing", () => {
    const { container } = render(<ProjectListSkeleton />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
