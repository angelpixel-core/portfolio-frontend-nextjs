import React from "react";

import "./styles.css";

interface ParagraphTextProps {
  text: string;
  className?: string;
}

const ParagraphText = ({
  text,
  className = "",
}: ParagraphTextProps): React.JSX.Element => {
  return <p className={`paragraph ${className}`}>{text}</p>;
};

export default ParagraphText;
