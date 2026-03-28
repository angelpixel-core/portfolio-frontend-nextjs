interface TimelineStepProps {
  value?: string;
  onChange: (_value: string) => void;
  showError: boolean;
}

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1_2_months", label: "1-2 months" },
  { value: "3_4_months", label: "3-4 months" },
  { value: "flexible", label: "Flexible" },
];

const TimelineStep = ({ value, onChange, showError }: TimelineStepProps) => {
  return (
    <div className="hire-flow-step">
      <p className="hire-flow-step__prompt">
        When are you hoping to kick off the work?
      </p>
      <div className="hire-flow-options" role="radiogroup">
        {TIMELINE_OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`hire-flow-option ${
                isSelected ? "hire-flow-option--active" : ""
              }`}
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {showError ? (
        <p className="hire-flow-error">Please select a timeline.</p>
      ) : null}
    </div>
  );
};

export default TimelineStep;
