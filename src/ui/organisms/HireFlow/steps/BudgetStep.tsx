interface BudgetStepProps {
  value?: string;
  onChange: (_value: string) => void;
  showError: boolean;
}

const BUDGET_OPTIONS = [
  { value: "project_based", label: "Project-based / Need quote" },
  { value: "1k_3k", label: "$1k - $3k" },
  { value: "under_5k", label: "Under $5k" },
  { value: "5k_15k", label: "$5k - $15k" },
  { value: "15k_30k", label: "$15k - $30k" },
  { value: "30k_plus", label: "$30k+" },
];

const BudgetStep = ({ value, onChange, showError }: BudgetStepProps) => {
  return (
    <div className="hire-flow-step">
      <p className="hire-flow-step__prompt">
        Choose a rough range so I can scope appropriately.
      </p>
      <div className="hire-flow-options" role="radiogroup">
        {BUDGET_OPTIONS.map((option) => {
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
        <p className="hire-flow-error">Please select a budget range.</p>
      ) : null}
    </div>
  );
};

export default BudgetStep;
