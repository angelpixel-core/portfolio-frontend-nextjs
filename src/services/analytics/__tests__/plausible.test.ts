type PlausibleModule = typeof import("../plausible");

const setupModule = ({
  nodeEnv,
  domain,
  host,
}: {
  nodeEnv: string;
  domain?: string;
  host?: string;
}) => {
  const mockTrackEvent = jest.fn();
  const mockPlausible = jest.fn(() => ({
    trackEvent: mockTrackEvent,
  }));

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

  let moduleExports: PlausibleModule | undefined;

  jest.resetModules();
  jest.isolateModules(() => {
    jest.doMock("plausible-tracker", () => ({
      __esModule: true,
      default: mockPlausible,
    }));

    moduleExports = require("../plausible");
  });

  return {
    moduleExports: moduleExports!,
    mockPlausible,
    mockTrackEvent,
  };
};

describe("plausible analytics service", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    Object.assign(process.env, { NODE_ENV: originalNodeEnv });
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
    jest.clearAllMocks();
  });

  it("initializes in production when config is present", () => {
    const { moduleExports, mockPlausible } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();

    expect(mockPlausible).toHaveBeenCalledTimes(1);
  });

  it("skips initialization outside production", () => {
    const { moduleExports, mockPlausible } = setupModule({
      nodeEnv: "development",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();

    expect(mockPlausible).not.toHaveBeenCalled();
  });

  it("does not initialize when configuration is missing", () => {
    const { moduleExports, mockPlausible } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
    });

    moduleExports.initPlausible();

    expect(mockPlausible).not.toHaveBeenCalled();
  });

  it("no-ops tracking in development", () => {
    const { moduleExports, mockPlausible, mockTrackEvent } = setupModule({
      nodeEnv: "development",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.trackEvent("cta_contact_click");

    expect(mockPlausible).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("no-ops tracking in tests", () => {
    const { moduleExports, mockPlausible, mockTrackEvent } = setupModule({
      nodeEnv: "test",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.trackEvent("cta_contact_click");

    expect(mockPlausible).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("passes domain and host to plausible tracker", () => {
    const { moduleExports, mockPlausible } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();

    expect(mockPlausible).toHaveBeenCalledWith({
      domain: "angelpixel.io",
      apiHost: window.location.origin,
    });
  });

  it("tracks events with props when initialized", () => {
    const { moduleExports, mockTrackEvent } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();
    moduleExports.trackEvent("cta_resume_click", {
      label: "Resume",
      href: "/resume",
    });

    expect(mockTrackEvent).toHaveBeenCalledWith("cta_resume_click", {
      props: {
        label: "Resume",
        href: "/resume",
      },
    });
  });

  it("tracks teaser and contact events when initialized", () => {
    const { moduleExports, mockTrackEvent } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();
    moduleExports.trackEvent("teaser_opened", {
      label: "Teaser Project",
      source: "project_teaser",
    });
    moduleExports.trackEvent("teaser_cta_clicked", {
      label: "Teaser Project",
      source: "project_teaser",
    });
    moduleExports.trackEvent("message_sent");
    moduleExports.trackEvent("spam_blocked");
    moduleExports.trackEvent("rate_limited");

    expect(mockTrackEvent).toHaveBeenCalledWith("teaser_opened", {
      props: {
        label: "Teaser Project",
        source: "project_teaser",
      },
    });
    expect(mockTrackEvent).toHaveBeenCalledWith("teaser_cta_clicked", {
      props: {
        label: "Teaser Project",
        source: "project_teaser",
      },
    });
    expect(mockTrackEvent).toHaveBeenCalledWith("message_sent", undefined);
    expect(mockTrackEvent).toHaveBeenCalledWith("spam_blocked", undefined);
    expect(mockTrackEvent).toHaveBeenCalledWith("rate_limited", undefined);
  });

  it("initializes tracker only once per session", () => {
    const { moduleExports, mockPlausible } = setupModule({
      nodeEnv: "production",
      domain: "angelpixel.io",
      host: "https://plausible.io",
    });

    moduleExports.initPlausible();
    moduleExports.initPlausible();

    expect(mockPlausible).toHaveBeenCalledTimes(1);
  });
});
