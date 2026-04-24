"use client";

import React, { useState } from "react";
import {
  buildTelegramMessage,
  buildTelegramUrl,
} from "@/lib/messaging/telegram";
import { getSocialUrl } from "@/lib/social-urls";
import { trackEvent } from "@/services/analytics";
import PaymentModal from "./PaymentModal";
import "./styles.css";

const getMonetizationMode = (): "checkout" | "contact" => {
  return process.env.NEXT_PUBLIC_MONETIZATION_MODE === "checkout"
    ? "checkout"
    : "contact";
};

export function StealPatternCTA(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const monetizationMode = getMonetizationMode();
  const isCheckoutMode = monetizationMode === "checkout";

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

  return (
    <section
      className="monetization"
      aria-labelledby={isCheckoutMode ? "monetization-heading" : undefined}
      aria-label={isCheckoutMode ? undefined : "Article contact call to action"}
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
        ) : telegramUrl ? (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="monetization__cta"
            onClick={handleContactClick}
          >
            Let&apos;s talk
          </a>
        ) : (
          <button
            type="button"
            className="monetization__cta monetization__cta--disabled"
            disabled
          >
            Let&apos;s talk
          </button>
        )}
      </div>
      {isCheckoutMode ? (
        <p className="monetization__hint">
          Copy-paste ready with minimal setup.
        </p>
      ) : null}

      {isCheckoutMode && isOpen ? (
        <PaymentModal onClose={() => setIsOpen(false)} />
      ) : null}
    </section>
  );
}

export default StealPatternCTA;
