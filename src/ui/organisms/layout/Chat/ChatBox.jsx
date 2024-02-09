"use client";

import { useState, useEffect } from "react";

import { LinkedInIcon, MicrosoftIcon } from "@/atoms/icons/_index";

const hoursJobTypes = [
  { name: "hours" },
  { name: "part-time" },
  { name: "full-time" },
];

const EmailInput = ({ onChange }) => {
  return (
    <div className="form-email">
      <label className="form-email_label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        name="email"
        required
        onChange={onChange}
        className="form-email_input"
      />
    </div>
  );
};

const EmailBox = ({ onChange }) => {
  return (
    <div className="form-email_container">
      <EmailInput onChange={onChange} />

      <div className="form-social">
        <div className="social_icon-container bg-light/90">
          <MicrosoftIcon />
        </div>
        <div className="social_icon-container bg-primaryDarkLinkedIn/90">
          <LinkedInIcon />
        </div>
      </div>
    </div>
  );
};

const JobTypeCheckBox = ({ name, onChange }) => {
  return (
    <div className="form-hours_option">
      <input
        id={name}
        type="checkbox"
        name={name}
        value={name}
        onChange={onChange}
        className="form-hours_option-input"
      />
      <label htmlFor={name} className="form-hours_option-label">
        {name}
      </label>
    </div>
  );
};

const MessageTextBox = ({ onChange, limit = 4500 }) => {
  return (
    <div className="form-message">
      <label className="form-message_label" htmlFor="job_message">
        Message
      </label>
      <textarea
        id="job_message"
        name="job_message"
        rows="4"
        required
        maxlength={limit}
        onChange={onChange}
        className="form-message_input"
      />
    </div>
  );
};

const AttachmentBox = ({ onChange }) => {
  return (
    <div className="form-attachment">
      <label className="form-attachment_label" htmlFor="job_attachment">
        Job Description
      </label>
      <input
        id="job_attachment"
        type="file"
        name="job_attachment"
        onChange={onChange}
        className="form-attachment_input"
      />
    </div>
  );
};

const Submit = ({ text }) => {
  return (
    <div className="form-send">
      <button className="form-send_input" type="submit">
        {text}
      </button>
    </div>
  );
};

export default function ChatBox() {
  const [email, setEmail] = useState("");
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleEmailKeyUp = (event) => {
    const emailRegex = /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/;
    const validateEmail = (address) => emailRegex.test(address);

    let emailInput = event.target;

    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add("form-email_input--error");
    } else {
      emailInput.classList.remove("form-email_input--error");
    }
  };

  const [jobTypes, setJobTypes] = useState([]);
  const handleJobTypeChange = (event) => {
    const { value, checked } = event.target;

    if (checked) setJobTypes([...jobTypes, value]);
    else setJobTypes(jobTypes.filter((selected) => selected !== value));
  };

  const [message, setMessage] = useState("");
  const handleMessageChange = (event) => setMessage(event.target.value);

  // TODO: handle Attachment input, only can be .pdf, .doc, .docx
  // const [attachment, setAttachment] = useState("");
  const handleAttachmentChange = () => {
    console.log("Attachment changes");
  };

  useEffect(() => {
    const emailInput = document.querySelector("#email");
    emailInput.addEventListener("keyup", handleEmailKeyUp);

    return () => emailInput.removeEventListener("keyup", handleEmailKeyUp);
  }, []);

  const submit = async () => {
    const formData = { email, jobTypes, message };

    // TODO: Change body form by progress bar
    // TODO: Secure Cross Site Scripting XSS
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed with HTTP Status Code: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // TODO: Clean inputs
        // TODO: Change progress bar by OK animation
        console.log({ data });
      })
      .catch((error) => {
        // TODO: Keep inputs
        // TODO: Change progress bar by OK animation
        // TODO: Handle errors including HTTP Status Code
        // TODO: Change progress bar by OK animation
        console.error(error.message);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <div className="chatbox_container">
      <form id="chatbox_form" className="chatbox_form" onSubmit={handleSubmit}>
        <EmailBox onChange={handleEmailChange} />

        <div className="form-hours_container">
          {hoursJobTypes.map(({ name }, index) => (
            <JobTypeCheckBox
              key={index}
              name={name}
              onChange={handleJobTypeChange}
            />
          ))}
        </div>

        <MessageTextBox onChange={handleMessageChange} />

        <AttachmentBox onChange={handleAttachmentChange} />

        <Submit text="Send Message" />
      </form>
    </div>
  );
}
