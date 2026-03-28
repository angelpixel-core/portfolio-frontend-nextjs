import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
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
  const [isDragActive, setIsDragActive] = useState(false);

  const resetInputValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getValidationError = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isAllowedExtension = allowedFileTypes.some(
      ({ ext }) => ext === extension
    );

    if (!isAllowedExtension) {
      return `Only ${allowedExtensionsLabel} allowed`;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      return `Max file size is ${MAX_ATTACHMENT_MB} MB`;
    }

    return null;
  };

  const applyAttachment = (file: File | null) => {
    if (!file) return;
    const validationError = getValidationError(file);

    if (validationError) {
      setError(validationError);
      setAttachment(null);
      resetInputValue();
      return;
    }

    setAttachment(file);
    setError(null);
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0] ?? null;
    if (!file) return;
    applyAttachment(file);
  };

  const handlePickAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setError(null);
    resetInputValue();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    if (!file) return;
    applyAttachment(file);
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
        <div
          className={`hire-flow-attachment__dropzone${
            isDragActive ? " hire-flow-attachment__dropzone--active" : ""
          }`}
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
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
    </div>
  );
};

export default NotesStep;
