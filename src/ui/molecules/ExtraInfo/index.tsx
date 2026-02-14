import "./styles.css";

import { AnimatedNumber } from "@/atoms/texts";

const ExtraInfo = ({ number, subtitle }) => {
  return (
    <div className="extra-info_container">
      <span className="extra-info_number">
        <AnimatedNumber value={number} />+
      </span>

      <h2 className="extra-info_title">{subtitle}</h2>
    </div>
  );
};

export default ExtraInfo;
