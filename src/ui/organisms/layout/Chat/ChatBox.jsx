"use client";

import { useState, useEffect } from "react";

import { LinkedInIcon, MicrosoftIcon } from "@/atoms/icons/_index";

const hoursJobTypes = [
  { name: "hours" },
  { name: "part-time" },
  { name: "full-time" },
];

export default function ChatBox() {
  const [email, setEmail] = useState("");
  const handleEmailChange = (event) => {
    const address = event.target.value;
    setEmail(address);
  };
  const handleEmailKeyUp = (event) => {
    const emailRegex = /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/;
    const validateEmail = (address) => emailRegex.test(address);

    const { value } = event.target;

    if (!validateEmail(value)) {
      /* TODO: set border-red, label message */
    } else {
      /* TODO: unset border-red, label message */
    }
  };

  const [jobTypes, setJobTypes] = useState([]);
  const handleJobTypeChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setJobTypes([...jobTypes, value]);
    } else {
      setJobTypes(jobTypes.filter((selected) => selected !== value));
    }
  };

  const [message, setMessage] = useState("");
  const handleMessageChange = (event) => setMessage(event.target.value);

  // TODO: handle Media input, only can be .pdf, .doc, .docx
  // const [media, setMedia] = useState("");

  useEffect(() => {
    const emailInput = document.querySelector("#email");
    emailInput.addEventListener("keyup", handleEmailKeyUp);

    return () => {
      emailInput.removeEventListener("keyup", handleEmailKeyUp);
    };
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
          throw new Error(
            `Request failed with status code: ${response.status}`
          );
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
        <div className="form-email_container">
          <div className="form-email">
            <label className="form-email_label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              onChange={handleEmailChange}
              className="form-email_input"
            />
          </div>

          <div className="form-social">
            <div className="social_icon-container bg-light/90">
              <MicrosoftIcon />
            </div>
            <div className="social_icon-container bg-primaryDarkLinkedIn/90">
              <LinkedInIcon />
            </div>
          </div>
        </div>

        <div className="form-hours_container">
          {hoursJobTypes.map(({ id, name }) => (
            <div key={id} className="form-hours_option">
              <label className="form-hours_option-label">
                <input
                  type="checkbox"
                  name={name}
                  value={name}
                  onChange={handleJobTypeChange}
                  className="form-hours_option-input"
                />
                {name}
              </label>
            </div>
          ))}
        </div>

        <div className="form-message">
          <label className="form-message_label" htmlFor="job_message">
            Message
          </label>
          <textarea
            id="job_message"
            name="job_message"
            rows="4"
            required
            onChange={handleMessageChange}
            className="form-message_input"
          />
        </div>

        <div className="form-media">
          <label className="form-media_label" htmlFor="job_media">
            Job Description
          </label>
          <input
            className="form-media_input"
            type="file"
            id="job_media"
            name="job_media"
          />
        </div>

        <div className="form-send">
          <button className="form-send_input" type="submit">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
