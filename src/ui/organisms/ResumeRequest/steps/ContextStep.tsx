interface ContextStepProps {
  value?: string;
  onChange: (_value: string) => void;
}

const ContextStep = ({ value, onChange }: ContextStepProps) => {
  return (
    <div className="resume-request-step">
      <div className="resume-request-field">
        <label
          className="resume-request-field__label"
          htmlFor="resume-request-context"
        >
          Context (optional)
        </label>
        <textarea
          id="resume-request-context"
          name="resumeRequestContext"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Share the company, industry, or opportunity context."
          maxLength={1000}
          rows={5}
          className="resume-request-field__textarea"
        />
      </div>
    </div>
  );
};

export default ContextStep;
