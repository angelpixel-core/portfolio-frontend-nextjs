interface RoleStepProps {
  value?: string;
  onChange: (_value: string) => void;
}

const RoleStep = ({ value, onChange }: RoleStepProps) => {
  return (
    <div className="resume-request-step">
      <div className="resume-request-field">
        <label
          className="resume-request-field__label"
          htmlFor="resume-request-role"
        >
          Role or project (optional)
        </label>
        <input
          id="resume-request-role"
          name="resumeRequestRole"
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Senior Frontend Engineer, Product Platform"
          maxLength={120}
          className="resume-request-field__input"
        />
      </div>
    </div>
  );
};

export default RoleStep;
