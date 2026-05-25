type PlausibleModule = typeof import("@/observability/analytics");

const setupModule = ({
  nodeEnv,
  domain,
  host,
}: {
  nodeEnv: string;
  domain?: string;
  host?: string;
}) => {
  Object.assign(process.env, { NODE_ENV: nodeEnv });

  if (domain) {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = domain;
  } else {
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  }

  if (host) {
    process.env.NEXT_PUBLIC_PLAUSIBLE_HOST = host;
  } else {
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
  }

  (window as any).plausible = jest.fn();
  document.head.innerHTML = "";

  let moduleExports: PlausibleModule | undefined;

  jest.resetModules();
  jest.isolateModules(() => {
    moduleExports = require("@/observability/analytics");
  });

  return {
    moduleExports: moduleExports!,
    mockPlausibleCall: (window as any).plausible as jest.Mock,
  };
};

describe("plausible analytics service", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    Object.assign(process.env, { NODE_ENV: originalNodeEnv });
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
    delete (window as any).plausible;
    document.head.innerHTML = "";
    jest.clearAllMocks();
  });

  it("injects plausible script in production when config is present", () => {
    const { moduleExports } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();

    const script = document.querySelector(
      'script[data-analytics="plausible"]'
    ) as HTMLScriptElement | null;

    expect(script).not.toBeNull();
    expect(script?.dataset.domain).toBe("angelpixel.io");
    expect(script?.src).toBe("https://plausible.io/js/script.js");
  });

  it("does not inject script outside production", () => {
    const { moduleExports } = setupModule({
      nodeEnv: "development",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();

    const script = document.querySelector('script[data-analytics="plausible"]');
    expect(script).toBeNull();
  });

  it("tracks events with props when initialized", () => {
    const { moduleExports, mockPlausibleCall } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();
    moduleExports.trackEvent("cta_resume_click", {
      label: "Resume",
      href: "/resume",
    });

    expect(mockPlausibleCall).toHaveBeenCalledWith("cta_resume_click", {
      props: {
        label: "Resume",
        href: "/resume",
      },
    });
  });
});
