import { logger } from "@/lib/logger";

export type AnalyticsEventName =
  | "cta_resume_click"
  | "cta_book_call_click"
  | "cta_contact_click"
  | "cta_subscribe_submit"
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

type PlausibleTrack = (
  _eventName: string,
  _options?: { props?: AnalyticsEventProps }
) => void;

type PlausibleWindow = Window & { plausible?: PlausibleTrack };

let isPlausibleInitialized = false;

const isProduction = process.env.NODE_ENV === "production";

const getPlausibleConfig = (): { domain: string; host: string } | null => {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;

  if (!domain || !host) return null;

  return { domain, host };
};

export const initPlausible = (): void => {
  if (!isProduction || typeof window === "undefined") return;
  if (isPlausibleInitialized) return;

  const config = getPlausibleConfig();
  if (!config) return;

  const plausibleWindow = window as PlausibleWindow;

  if (!plausibleWindow.plausible) {
    plausibleWindow.plausible = () => {
      // no-op queue stub until script loads
    };
  }

  const existingScript = document.querySelector(
    'script[data-analytics="plausible"]'
  );

  if (!existingScript) {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.analytics = "plausible";
    script.dataset.domain = config.domain;
    script.src = `${config.host.replace(/\/$/, "")}/js/script.js`;
    document.head.appendChild(script);
  }

  isPlausibleInitialized = true;
};

export const trackEvent = (
  name: AnalyticsEventName,
  props?: AnalyticsEventProps
): void => {
  if (!isProduction || typeof window === "undefined") return;

  if (!isPlausibleInitialized) {
    initPlausible();
  }

  try {
    const plausibleWindow = window as PlausibleWindow;
    plausibleWindow.plausible?.(name, props ? { props } : undefined);
  } catch (error) {
    logger.error("Analytics", "Client event tracking failed", error);
  }
};
