"use client";

import React from "react";

export interface CodeBlockProps {
  code: string;
  language: string;
}

/**
 * CodeBlock component with syntax highlighting
 * Uses CSS classes for basic highlighting - can be extended with prism-react-renderer
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">(
    "idle"
  );

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1500);
    }
  }, [code]);

  // Basic keyword highlighting for common languages
  const highlightCode = (code: string, lang: string): string => {
    let highlighted = code
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (["tsx", "ts", "typescript", "jsx", "js", "javascript"].includes(lang)) {
      const placeholders: string[] = [];
      const storePlaceholder = (value: string, className: string): string => {
        const token = `___TOKEN_${placeholders.length}___`;
        placeholders.push(`<span class="${className}">${value}</span>`);
        return token;
      };

      // Extract comments and strings first to avoid highlighting inside generated HTML markup
      highlighted = highlighted.replace(/(\/\/.*$)/gm, (match) =>
        storePlaceholder(match, "code-comment")
      );

      highlighted = highlighted.replace(
        /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
        (match) => storePlaceholder(match, "code-string")
      );

      // Keywords
      highlighted = highlighted.replace(
        /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|async|await|type|interface|extends|implements|class|new|this|try|catch|throw|typeof|instanceof)\b/g,
        '<span class="code-keyword">$1</span>'
      );

      // Numbers
      highlighted = highlighted.replace(
        /\b(\d+)\b/g,
        '<span class="code-number">$1</span>'
      );

      // Types (capitalized words that look like types)
      highlighted = highlighted.replace(
        /\b([A-Z][a-zA-Z0-9]*)\b/g,
        '<span class="code-type">$1</span>'
      );

      // Restore extracted comments/strings
      highlighted = highlighted.replace(/___TOKEN_(\d+)___/g, (_, index) => {
        return placeholders[Number(index)] ?? "";
      });
    }

    return highlighted;
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__language">{language}</span>
        <button
          type="button"
          className="code-block__copy-button"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copyState === "copied"
            ? "Copied"
            : copyState === "error"
              ? "Error"
              : "Copy"}
        </button>
      </div>
      <pre className="code-block__pre">
        <code
          className={`code-block__code language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
