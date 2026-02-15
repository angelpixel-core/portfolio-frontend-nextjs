import React from "react";

/**
 * LinuxIcon - Simplified Tux penguin icon
 * Optimized from 694 paths to ~20 paths for better DOM performance
 */
const LinuxIcon = (): React.JSX.Element => {
  return (
    <>
      {/* Body */}
      <ellipse cx="64" cy="85" rx="35" ry="40" fill="#333" />
      {/* Belly */}
      <ellipse cx="64" cy="90" rx="25" ry="30" fill="#F5C518" />
      {/* Head */}
      <circle cx="64" cy="38" r="28" fill="#333" />
      {/* Face */}
      <ellipse cx="64" cy="42" rx="20" ry="18" fill="#FFF" />
      {/* Left eye */}
      <ellipse cx="56" cy="38" rx="5" ry="6" fill="#FFF" />
      <circle cx="56" cy="38" r="3" fill="#333" />
      {/* Right eye */}
      <ellipse cx="72" cy="38" rx="5" ry="6" fill="#FFF" />
      <circle cx="72" cy="38" r="3" fill="#333" />
      {/* Beak */}
      <path d="M64 44 L58 52 L70 52 Z" fill="#F4A623" />
      <path d="M64 48 L60 52 L68 52 Z" fill="#D4871E" />
      {/* Left foot */}
      <ellipse cx="45" cy="120" rx="12" ry="6" fill="#F4A623" />
      {/* Right foot */}
      <ellipse cx="83" cy="120" rx="12" ry="6" fill="#F4A623" />
      {/* Left wing */}
      <ellipse
        cx="30"
        cy="75"
        rx="8"
        ry="25"
        fill="#333"
        transform="rotate(-15 30 75)"
      />
      {/* Right wing */}
      <ellipse
        cx="98"
        cy="75"
        rx="8"
        ry="25"
        fill="#333"
        transform="rotate(15 98 75)"
      />
    </>
  );
};

export default LinuxIcon;
