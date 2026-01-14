import { render } from "@testing-library/react";
import ArticleListSkeleton from "../ArticleListSkeleton";

describe("ArticleListSkeleton", () => {
  it("renders a list of skeleton cards without crashing", () => {
    const { container } = render(<ArticleListSkeleton />);

    // Basic snapshot of the skeleton structure
    expect(container.firstChild).toMatchSnapshot();
  });
});
