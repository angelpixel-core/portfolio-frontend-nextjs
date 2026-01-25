import { useState, ChangeEvent } from "react";

import { fileTypes } from "../presets";

export function AttachmentBox() {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const attachmentInput = event.target;

    const attachmentLabel =
      attachmentInput.previousElementSibling as HTMLLabelElement | null;

    const fileType = attachmentInput.value.split(".").pop() || "";

    if (!fileTypes.some(({ ext }) => ext === fileType)) {
      attachmentLabel?.classList.add("form-attachment_label--error");
      const attachmentDescription = attachmentLabel?.querySelector(
        ".attachment_label-description"
      );
      attachmentDescription?.classList.add(
        "attachment_label-description--error"
      );

      setError(
        `Only ${fileTypes.map(({ ext }) => ext.toUpperCase()).join(" ")} is allowed`
      );
      setAttachment(null);
    } else {
      attachmentLabel?.classList.remove("form-attachment_label--error");
      const attachmentDescription = attachmentLabel?.querySelector(
        ".attachment_label-description"
      );
      attachmentDescription?.classList.remove(
        "attachment_label-description--error"
      );

      const file = attachmentInput.files?.[0] || null;
      setAttachment(file);
      setError(null);
    }
  };

  return (
    <div className="form-attachment">
      <label className="form-attachment_label" htmlFor="attachment">
        <div className="attachment_label-title">Job Description</div>
        <div className="attachment_label-description">
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
        className="form-attachment_input"
      />
    </div>
  );
}
