"use client";

import { useState } from "react";
import { NeumorphicToggle } from "@/atoms/buttons/NeumorphicToggle";
import { hoursJobTypes } from "../presets";

interface JobTypeBoxProps {
  /** Optional callback when selection changes */
  onChange?: (_selected: string[]) => void;
}

/**
 * JobTypeBox - Multi-select job type toggles
 *
 * Allows selecting multiple job types (hours, part-time, full-time)
 * using neumorphic toggle buttons.
 */
export function JobTypeBox({ onChange }: JobTypeBoxProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleToggle = (id: string, isPressed: boolean) => {
    const newSelected = isPressed
      ? [...selectedTypes, id]
      : selectedTypes.filter((type) => type !== id);

    setSelectedTypes(newSelected);
    onChange?.(newSelected);
  };

  return (
    <div className="form-hours_container">
      {hoursJobTypes.map((jobType) => (
        <NeumorphicToggle
          key={jobType.name}
          id={jobType.name}
          label={jobType.name}
          isPressed={selectedTypes.includes(jobType.name)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
