import Plausible from "plausible-tracker";

export type AnalyticsEventName =
  | "cta_resume_click"
  | "cta_book_call_click"
  | "cta_contact_click"
  | "nav_primary_click"
  | "nav_menu_click"
  | "nav_footer_click"
  | "article_view"
  | "project_view"
  | "project_demo_click"
  | "project_architecture_click"
  | "details_expand"
  | "social_click"
  | "teaser_opened"
  | "teaser_cta_clicked"
  | "message_sent"
  | "spam_blocked"
  | "rate_limited";

export type AnalyticsEventProps = {
  label?: string;
  href?: string;
  slug?: string;
  section?: string;
  source?: string;
};

let plausibleTracker: ReturnType<typeof Plausible> | null = null;

const isProduction = process.env.NODE_ENV === "production";

const getPlausibleConfig = (): { domain: string; host: string } | null => {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;

  if (!domain || !host) return null;

  return { domain, host };
};

export const initPlausible = (): void => {
  if (!isProduction || typeof window === "undefined") return;
  if (plausibleTracker) return;

  const config = getPlausibleConfig();
  if (!config) return;

  plausibleTracker = Plausible({
    domain: config.domain,
    apiHost: config.host,
  });
};

export const trackEvent = (
  name: AnalyticsEventName,
  props?: AnalyticsEventProps
): void => {
  if (!isProduction || typeof window === "undefined") return;

  if (!plausibleTracker) {
    initPlausible();
  }

  plausibleTracker?.trackEvent(name, props ? { props } : undefined);
};
