interface NotesStepProps {
  value?: string;
  onChange: (_value: string) => void;
}

const NotesStep = ({ value, onChange }: NotesStepProps) => {
  return (
    <div className="resume-request-step">
      <div className="resume-request-field">
        <label
          className="resume-request-field__label"
          htmlFor="resume-request-notes"
        >
          Notes (optional)
        </label>
        <textarea
          id="resume-request-notes"
          name="resumeRequestNotes"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Anything else I should know before I send it?"
          maxLength={2000}
          rows={6}
          className="resume-request-field__textarea"
        />
      </div>
    </div>
  );
};

export default NotesStep;
