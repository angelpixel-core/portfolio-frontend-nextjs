import { useState } from "react";

export function JobTypeBox({ name }) {
  const [jobTypes, setJobTypes] = useState([]);
  const handleChange = (event) => {
    const { value, checked } = event.target;

    if (checked) setJobTypes([...jobTypes, value]);
    else setJobTypes(jobTypes.filter((selected) => selected !== value));
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
