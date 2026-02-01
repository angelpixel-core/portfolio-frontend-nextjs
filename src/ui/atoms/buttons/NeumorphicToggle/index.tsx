"use client";

import "./styles.css";

interface NeumorphicToggleProps {
  /** Unique identifier for the toggle */
  id: string;
  /** Display label */
  label: string;
  /** Whether the toggle is currently pressed/selected */
  isPressed: boolean;
  /** Callback when toggle state changes */
  onToggle: (_id: string, _isPressed: boolean) => void;
  /** Optional className for customization */
  className?: string;
}

/**
 * NeumorphicToggle - A soft UI checkbox with circular indicator
 *
 * Visual states:
 * - Off: Small circle, no glow
 * - On: Small circle with glow/light effect
 *
 * Supports multi-selection when used in groups.
 */
export function NeumorphicToggle({
  id,
  label,
  isPressed,
  onToggle,
  className = "",
}: NeumorphicToggleProps) {
  const handleClick = () => {
    onToggle(id, !isPressed);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`neumorphic-toggle ${className}`}
      aria-pressed={isPressed}
      data-testid={`toggle-${id}`}
    >
      <span
        className={`neumorphic-toggle__indicator ${isPressed ? "neumorphic-toggle__indicator--on" : ""}`}
      />
      <span className="neumorphic-toggle__label">{label}</span>
    </button>
  );
}

export default NeumorphicToggle;
