"use client";

import React, { useState } from "react";
import PaymentModal from "./PaymentModal";
import "./styles.css";

export function StealPatternCTA(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className="monetization"
      aria-labelledby="monetization-heading"
      data-testid="article-monetization"
    >
      <p className="monetization__kicker">Used in real client funnels</p>
      <h2 id="monetization-heading" className="monetization__title">
        Want this pattern ready to use?
      </h2>
      <p className="monetization__description">
        This is the reusable block that powers the conversion entry point from
        this article.
      </p>
      <div className="monetization__cta-row">
        <button
          type="button"
          className="monetization__cta"
          onClick={() => setIsOpen(true)}
        >
          Steal this pattern
        </button>
      </div>
      <p className="monetization__hint">Copy-paste ready with minimal setup.</p>

      {isOpen ? <PaymentModal onClose={() => setIsOpen(false)} /> : null}
    </section>
  );
}

export default StealPatternCTA;
