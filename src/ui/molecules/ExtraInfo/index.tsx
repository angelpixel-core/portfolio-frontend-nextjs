import React from "react";

import "./styles.css";

import { AnimatedNumber } from "@/atoms/texts";

interface ExtraInfoProps {
  number: number;
  subtitle: string;
}

const ExtraInfo = ({ number, subtitle }: ExtraInfoProps): React.JSX.Element => {
  return (
    <div className="extra-info__container">
      <span className="extra-info__number">
        <AnimatedNumber value={number} />+
      </span>

      <h2 className="extra-info__title">{subtitle}</h2>
    </div>
  );
};

export default ExtraInfo;
