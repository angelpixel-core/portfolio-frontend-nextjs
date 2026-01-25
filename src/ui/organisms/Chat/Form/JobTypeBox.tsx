import { useState, ChangeEvent } from "react";

interface JobTypeBoxProps {
  name: string;
}

export function JobTypeBox({ name }: JobTypeBoxProps) {
  const [, setJobTypes] = useState<string[]>([]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) setJobTypes((prev) => [...prev, value]);
    else setJobTypes((prev) => prev.filter((selected) => selected !== value));
  };

  return (
    <div className="form-hours_option">
      <input
        id={name}
        type="radio"
        name="workday"
        value={name}
        onChange={handleChange}
        className="form-hours_option-input"
      />
      <label htmlFor={name} className="form-hours_option-label">
        {name}
      </label>
    </div>
  );
}
