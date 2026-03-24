import { useState, ChangeEvent } from "react";

import { fileTypes } from "../presets";

const MAX_ATTACHMENT_MB = 9;
const MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_MB * 1024 * 1024;

export function AttachmentBox() {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const attachmentInput = event.target;
    const fileType = attachmentInput.value.split(".").pop() || "";
    const file = attachmentInput.files?.[0] || null;

    if (!fileTypes.some(({ ext }) => ext === fileType)) {
      setError(
        `Only ${fileTypes.map(({ ext }) => ext.toUpperCase()).join(" ")} is allowed`
      );
      setAttachment(null);
      attachmentInput.value = "";
      return;
    }

    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      setError(`Max file size is ${MAX_ATTACHMENT_MB} MB`);
      setAttachment(null);
      attachmentInput.value = "";
      return;
    } else {
      setAttachment(file);
      setError(null);
    }
  };

  return (
    <div className="form-attachment">
      <label
        className={`form-attachment__label${error ? " form-attachment__label--error" : ""}`}
        htmlFor="attachment"
      >
        <div className="attachment__label-title">Job Description</div>
        <div
          className={`attachment__label-description${error ? " attachment__label-description--error" : ""}`}
        >
          {error
            ? error
            : attachment
              ? attachment.name
              : fileTypes.map(({ ext }) => ext.toUpperCase()).join(" ")}
        </div>
      </label>
      <input
        id="attachment"
        type="file"
        name="attachment"
        accept={fileTypes.map(({ mimetype }) => mimetype).join(",")}
        multiple
        onChange={handleChange}
        className="form-attachment__input"
      />
      {error ? <span className="form-attachment__error">{error}</span> : null}
    </div>
  );
}
