import { LinkedInIcon, MicrosoftIcon } from "@/atoms/icons/_index";

export default function ChatBox() {
  return (
    <div className="chatbox_container">
      <form action="/api/messages" method="POST" className="chatbox_form">
        <div className="form-email_container">
          <div className="form-email">
            <label className="form-email_label" htmlFor="email">
              Email
            </label>
            <input
              className="form-email_input"
              type="email"
              id="email"
              name="email"
              required
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
          <div className="form-hours_option">
            <input
              id="job_hours"
              className="form-hours_option-input"
              type="checkbox"
              name="job_type[]"
              value="hours"
            />
            <label className="form-hours_option-label" htmlFor="job_hours">
              Hours
            </label>
          </div>

          <div className="form-hours_option">
            <input
              id="job_part-time"
              className="form-hours_option-input"
              type="checkbox"
              name="job_type[]"
              value="part-time"
            />
            <label className="form-hours_option-label" htmlFor="job_part-time">
              Part-Time
            </label>
          </div>

          <div className="form-hours_option">
            <input
              id="job_full-time"
              className="form-hours_option-input"
              type="checkbox"
              name="job_type[]"
              value="full-time"
            />
            <label className="form-hours_option-label" htmlFor="job_full-time">
              Full-Time
            </label>
          </div>
        </div>

        <div className="form-message">
          <label className="form-message_label" htmlFor="job_message">
            Message
          </label>
          <textarea
            className="form-message_input"
            id="job_message"
            name="job_message"
            rows="4"
            required
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
          <input className="form-send_input" type="submit" value="Enviar" />
        </div>
      </form>
    </div>
  );
}
