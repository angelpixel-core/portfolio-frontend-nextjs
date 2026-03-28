import { useRef, useState, type ChangeEvent } from "react";
import ClipIcon from "@/atoms/icons/ClipIcon";

interface NotesStepProps {
  value?: string;
  onChange: (_value: string) => void;
}

const MAX_ATTACHMENT_MB = 5;
const MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_MB * 1024 * 1024;

const allowedFileTypes = [
  { ext: "pdf", mime: "application/pdf" },
  { ext: "doc", mime: "application/msword" },
  {
    ext: "docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  { ext: "png", mime: "image/png" },
  { ext: "jpg", mime: "image/jpeg" },
  { ext: "jpeg", mime: "image/jpeg" },
];

const allowedExtensionsLabel = "PDF, DOC, DOCX, PNG, JPG";

const NotesStep = ({ value, onChange }: NotesStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isAllowedExtension = allowedFileTypes.some(
      ({ ext }) => ext === extension
    );

    if (!isAllowedExtension) {
      setError(`Only ${allowedExtensionsLabel} allowed`);
      setAttachment(null);
      input.value = "";
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError(`Max file size is ${MAX_ATTACHMENT_MB} MB`);
      setAttachment(null);
      input.value = "";
      return;
    }

    setAttachment(file);
    setError(null);
  };

  const handlePickAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const statusText = error
    ? error
    : attachment
      ? attachment.name
      : allowedExtensionsLabel;

  return (
    <div className="hire-flow-step">
      <div className="hire-flow-field">
        <label className="hire-flow-field__label" htmlFor="hire-flow-notes">
          Notes or attachments (optional)
        </label>
        <textarea
          id="hire-flow-notes"
          name="hireFlowNotes"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Share anything helpful before we connect."
          maxLength={1000}
          rows={5}
          className="hire-flow-field__textarea"
        />
      </div>
      <div className="hire-flow-attachment">
        <button
          type="button"
          className="hire-flow-attachment__button"
          onClick={handlePickAttachment}
          aria-label="Attach a file"
        >
          <ClipIcon className="hire-flow-attachment__icon" />
          <span>Attach file</span>
        </button>
        <div className="hire-flow-attachment__meta">
          <span
            className={`hire-flow-attachment__status${
              error ? " hire-flow-attachment__status--error" : ""
            }`}
          >
            {statusText}
          </span>
          {attachment ? (
            <button
              type="button"
              className="hire-flow-attachment__remove"
              onClick={handleRemoveAttachment}
              aria-label="Remove attachment"
            >
              x
            </button>
          ) : null}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="hireFlowAttachment"
          accept={[...new Set(allowedFileTypes.map(({ mime }) => mime))].join(
            ","
          )}
          onChange={handleAttachmentChange}
          className="hire-flow-attachment__input"
        />
      </div>
    </div>
  );
};

export default NotesStep;
