"use client";

import { hoursJobTypes } from "./presets";

import { EmailBox } from "./Form/EmailBox";
import { JobTypeBox } from "./Form/JobTypeBox";
import { MessageBox } from "./Form/MessageBox";
import { AttachmentBox } from "./Form/AttachmentBox";
import { Submit } from "./Form/Submit";

import { useDispatch } from "react-redux";
import { setIsChatOpen } from "@/slices/chat/chatSlice";

export default function ChatBox() {
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log("Disable Contact Form Inputs");
    const response = await fetch("/api/messages", {
      method: "POST",
      body: new FormData(event.target),
    })
      .then((res) => res)
      .catch((err) => console.error(err));

    if (response.ok) {
      dispatch(setIsChatOpen(false));
      console.log("Close Form");
    } else {
      // console.log("Enable Inputs");
      const { message } = await response.json();
      console.error(`ERROR | ${message}`);
    }
  };

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
