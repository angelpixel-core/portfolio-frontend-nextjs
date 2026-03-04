import "@testing-library/jest-dom";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const originalConsoleError = console.error;
const actWarningMatchers = [
  "Warning: An update to",
  "Warning: A suspended resource finished loading inside a test, but the event was not wrapped in act",
  "not wrapped in act(...)",
];

beforeAll(() => {
  console.error = (...args) => {
    const firstArg = typeof args[0] === "string" ? args[0] : "";
    const shouldSuppress = actWarningMatchers.some((pattern) =>
      firstArg.includes(pattern)
    );

    if (shouldSuppress) {
      return;
    }

    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock Next.js navigation for all tests
// Required by TransitionProvider which uses useRouter and usePathname
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next/link", () => {
  const MockLink = ({ href, children, ...props }) => {
    const normalizedHref =
      typeof href === "string" ? href : href?.pathname || "";
    return (
      <a href={normalizedHref} {...props}>
        {children}
      </a>
    );
  };

  MockLink.displayName = "MockNextLink";

  return MockLink;
});
