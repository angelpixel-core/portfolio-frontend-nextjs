import React from "react";

import "./styles.css";

import { AnimatedNumberSkeleton } from "@/atoms/texts/AnimatedNumber/skeleton";

export function ExtraInfoSkeleton(): React.JSX.Element {
  return (
    <div className="extra-info_container">
      <span className="extra-info_number">
        <AnimatedNumberSkeleton />+
      </span>

      <h2 className="extra-info_title">subtitle</h2>
    </div>
  );
}
