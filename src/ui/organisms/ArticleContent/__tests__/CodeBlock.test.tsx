/**
 * CodeBlock Component Tests
 * Story 4.2: Article Content Reading - Syntax Highlighting
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CodeBlock } from "../CodeBlock";

describe("CodeBlock", () => {
  const writeTextMock = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeTextMock.mockClear();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  describe("rendering", () => {
    it("renders code content", () => {
      render(<CodeBlock code="const x = 1;" language="tsx" />);

      expect(screen.getByText(/const/)).toBeInTheDocument();
    });

    it("displays language label", () => {
      render(<CodeBlock code="const x = 1;" language="typescript" />);

      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("renders multiline code", () => {
      const code = `const foo = "bar";
const baz = 123;`;

      render(<CodeBlock code={code} language="tsx" />);

      expect(screen.getByText(/foo/)).toBeInTheDocument();
      expect(screen.getByText(/baz/)).toBeInTheDocument();
    });

    it("renders copy button", () => {
      render(<CodeBlock code="const x = 1;" language="tsx" />);

      expect(
        screen.getByRole("button", { name: /copy code/i })
      ).toBeInTheDocument();
    });
  });

  describe("copy action", () => {
    it("copies code to clipboard", async () => {
      render(<CodeBlock code="const x = 1;" language="tsx" />);

      fireEvent.click(screen.getByRole("button", { name: /copy code/i }));

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith("const x = 1;");
      });
    });
  });

  describe("syntax highlighting", () => {
    it("highlights keywords", () => {
      const { container } = render(
        <CodeBlock code="const example = 1;" language="tsx" />
      );

      const codeElement = container.querySelector("code");
      expect(codeElement?.innerHTML).toContain("code-keyword");
    });

    it("highlights strings", () => {
      const { container } = render(
        <CodeBlock code='const str = "hello";' language="tsx" />
      );

      const codeElement = container.querySelector("code");
      expect(codeElement?.innerHTML).toContain("code-string");
    });

    it("highlights numbers", () => {
      const { container } = render(
        <CodeBlock code="const num = 42;" language="tsx" />
      );

      const codeElement = container.querySelector("code");
      expect(codeElement?.innerHTML).toContain("code-number");
    });

    it("highlights types (capitalized words)", () => {
      const { container } = render(
        <CodeBlock code="const comp: React.FC = () => null;" language="tsx" />
      );

      const codeElement = container.querySelector("code");
      expect(codeElement?.innerHTML).toContain("code-type");
    });
  });

  describe("escaping", () => {
    it("escapes HTML in code", () => {
      const { container } = render(
        <CodeBlock code="<div>test</div>" language="tsx" />
      );

      const codeElement = container.querySelector("code");
      expect(codeElement?.innerHTML).toContain("&lt;div&gt;");
      expect(codeElement?.innerHTML).not.toContain("<div>test</div>");
    });
  });

  describe("accessibility", () => {
    it("uses pre and code elements", () => {
      const { container } = render(<CodeBlock code="test" language="tsx" />);

      expect(container.querySelector("pre")).toBeInTheDocument();
      expect(container.querySelector("code")).toBeInTheDocument();
    });

    it("applies language class to code element", () => {
      const { container } = render(
        <CodeBlock code="test" language="typescript" />
      );

      const codeElement = container.querySelector("code");
      expect(codeElement).toHaveClass("language-typescript");
    });
  });
});
