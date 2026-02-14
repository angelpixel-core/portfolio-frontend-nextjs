import React from "react";

import "./styles.css";

interface BoxShadowProps {
  variant?: "default" | "list-item";
}

export const BoxShadow = ({
  variant = "default",
}: BoxShadowProps): React.JSX.Element => {
  const className =
    variant === "list-item" ? "box-shadow--list-item" : "box-shadow";
  return <div className={className} />;
};
