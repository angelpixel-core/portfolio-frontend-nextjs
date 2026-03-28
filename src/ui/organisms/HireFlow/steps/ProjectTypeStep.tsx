interface ProjectTypeStepProps {
  value?: string;
  onChange: (_value: string) => void;
  showError: boolean;
}

const PROJECT_TYPES = [
  { value: "marketing_site", label: "Marketing website" },
  { value: "product_ui", label: "Product UI" },
  { value: "brand_refresh", label: "Brand refresh" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Something else" },
];

const ProjectTypeStep = ({
  value,
  onChange,
  showError,
}: ProjectTypeStepProps) => {
  return (
    <div className="hire-flow-step">
      <p className="hire-flow-step__prompt">
        Select the project type that best matches your needs.
      </p>
      <div className="hire-flow-options" role="radiogroup">
        {PROJECT_TYPES.map((option) => {
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
        <p className="hire-flow-error">Please select a project type.</p>
      ) : null}
    </div>
  );
};

export default ProjectTypeStep;
