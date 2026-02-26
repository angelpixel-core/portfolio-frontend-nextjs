import React from "react";

import "./styles.css";

import { AnimatedNumberSkeleton } from "@/atoms/texts/AnimatedNumber/skeleton";

export function ExtraInfoSkeleton(): React.JSX.Element {
  return (
    <div className="extra-info__container">
      <span className="extra-info__number">
        <AnimatedNumberSkeleton />+
      </span>

      <h2 className="extra-info__title">subtitle</h2>
    </div>
  );
}
