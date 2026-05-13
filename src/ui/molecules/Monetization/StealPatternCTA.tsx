"use client";

import React, { useState } from "react";
import {
  buildTelegramMessage,
  buildTelegramUrl,
} from "@/lib/messaging/telegram";
import { getSocialUrl } from "@/lib/social-urls";
import { trackEvent } from "@/observability/analytics";
import PaymentModal from "./PaymentModal";
import "./styles.css";

type MonetizationMode = "checkout" | "contact" | "subscribe";

interface StealPatternCTAProps {
  articleSlug?: string;
  source?: string;
}

type SubscribeState = "idle" | "sending" | "success" | "error";
type SubscribeSuccessMessage = "inbox" | "thanks";

const getMonetizationMode = (): MonetizationMode => {
  const mode = process.env.NEXT_PUBLIC_MONETIZATION_MODE;
  if (mode === "checkout" || mode === "subscribe") {
    return mode;
  }

  return "contact";
};

const isEmailFormatValid = (value: string): boolean => {
  return /^.+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export function StealPatternCTA({
  articleSlug,
  source = "article_cta",
}: StealPatternCTAProps): React.JSX.Element {
  const [formStart] = useState<number>(() => Date.now());
  const [isOpen, setIsOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [subscribeState, setSubscribeState] = useState<SubscribeState>("idle");
  const [subscribeSuccessMessage, setSubscribeSuccessMessage] =
    useState<SubscribeSuccessMessage>("inbox");
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const monetizationMode = getMonetizationMode();
  const isCheckoutMode = monetizationMode === "checkout";
  const isContactMode = monetizationMode === "contact";
  const isSubscribeMode = monetizationMode === "subscribe";

  const telegramBaseUrl = getSocialUrl("telegram");
  const telegramUrl = telegramBaseUrl
    ? buildTelegramUrl(telegramBaseUrl, buildTelegramMessage())
    : "";

  const handleContactClick = () => {
    if (!telegramUrl) {
      return;
    }

    trackEvent("cta_contact_click", {
      label: "article_lets_talk",
      href: telegramUrl,
    });
  };

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = subscribeEmail.trim().toLowerCase();
    if (!isEmailFormatValid(email)) {
      setSubscribeState("error");
      setSubscribeError("Enter a valid email.");
      return;
    }

    setSubscribeState("sending");
    setSubscribeError(null);

    try {
      const payload: {
        email: string;
        source: string;
        articleSlug?: string;
        honeypot?: string;
        formStart?: number;
      } = {
        email,
        source,
        honeypot,
        formStart,
      };

      if (articleSlug) {
        payload.articleSlug = articleSlug;
      }

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok || body?.ok !== true) {
        setSubscribeState("error");
        setSubscribeError("Could not subscribe right now. Try again.");
        return;
      }

      setSubscribeSuccessMessage(
        body?.delivery === "degraded" ? "thanks" : "inbox"
      );

      trackEvent("cta_subscribe_submit", {
        label: "article_subscribe",
        source,
        slug: articleSlug ?? "",
      });
      setSubscribeState("success");
      setSubscribeError(null);
    } catch {
      setSubscribeState("error");
      setSubscribeError("Could not subscribe right now. Try again.");
    }
  };

  return (
    <section
      className="monetization"
      aria-labelledby={isCheckoutMode ? "monetization-heading" : undefined}
      aria-label={
        isCheckoutMode ? undefined : "Article conversion call to action"
      }
      data-testid="article-monetization"
    >
      {isCheckoutMode ? (
        <>
          <p className="monetization__kicker">Used in real client funnels</p>
          <h2 id="monetization-heading" className="monetization__title">
            Want this pattern ready to use?
          </h2>
          <p className="monetization__description">
            This is the reusable block that powers the conversion entry point
            from this article.
          </p>
        </>
      ) : null}
      <div className="monetization__cta-row">
        {isCheckoutMode ? (
          <button
            type="button"
            className="monetization__cta"
            onClick={() => setIsOpen(true)}
          >
            Steal this pattern
          </button>
        ) : isContactMode && telegramUrl ? (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="monetization__cta"
            onClick={handleContactClick}
          >
            Let&apos;s talk
          </a>
        ) : isContactMode ? (
          <button
            type="button"
            className="monetization__cta monetization__cta--disabled"
            disabled
          >
            Let&apos;s talk
          </button>
        ) : isSubscribeMode ? (
          <form
            className="monetization__subscribe-form"
            onSubmit={handleSubscribe}
          >
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="monetization__honeypot"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
            <div className="monetization__subscribe-row">
              <input
                id="subscribe-email"
                type="email"
                value={subscribeEmail}
                onChange={(event) => {
                  setSubscribeEmail(event.target.value);
                  if (subscribeState !== "idle") {
                    setSubscribeState("idle");
                    setSubscribeError(null);
                  }
                }}
                className="monetization__subscribe-input"
                placeholder="you@company.com"
                required
                aria-label="Email address"
                autoComplete="email"
              />
              <button
                type="submit"
                className="monetization__cta"
                disabled={subscribeState === "sending"}
              >
                {subscribeState === "sending" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {subscribeState === "success" ? (
              <p className="monetization__status monetization__status--success">
                {subscribeSuccessMessage === "inbox"
                  ? "Check your inbox"
                  : "Thanks for subscribing"}
              </p>
            ) : null}
            {subscribeError ? (
              <p className="monetization__status monetization__status--error">
                {subscribeError}
              </p>
            ) : null}
          </form>
        ) : null}
      </div>
      {isCheckoutMode ? (
        <p className="monetization__hint">
          Copy-paste ready with minimal setup.
        </p>
      ) : null}
      {isSubscribeMode ? (
        <p className="monetization__hint">
          Get product updates and early release access.
        </p>
      ) : null}

      {isCheckoutMode && isOpen ? (
        <PaymentModal onClose={() => setIsOpen(false)} />
      ) : null}
    </section>
  );
}

export default StealPatternCTA;
