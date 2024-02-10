"use client";

import { hoursJobTypes } from "./presets";
import { handleSubmit } from "./handleSubmit";

import { EmailBox } from "./Form/EmailBox";
import { JobTypeBox } from "./Form/JobTypeBox";
import { MessageBox } from "./Form/MessageBox";
import { AttachmentBox } from "./Form/AttachmentBox";
import { Submit } from "./Form/Submit";

export default function ChatBox() {
  return (
    <>
      <form id="chatbox_form" className="chatbox_form" onSubmit={handleSubmit}>
        <EmailBox />

        <div className="form-hours_container">
          {hoursJobTypes.map(({ name }, index) => (
            <JobTypeBox key={index} name={name} />
          ))}
        </div>

        <MessageBox />

        <AttachmentBox />

        <Submit text="Send Message" />
      </form>
    </>
  );
}
