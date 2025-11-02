import "./styles.css";

export const metadata = {
  title: "AngelPixel - Coming Soon",
  description: "AngelPixel is working on something amazing. Our new site is under construction and will be launching soon. Contact us for more information.",
};

export default function ComingSoonPage() {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <main id="main-content" role="main" className="coming-soon-main">
        <div className="coming-soon-container">
          <h1 className="coming-soon-title">We're working on something amazing</h1>
          <p className="coming-soon-description">
            This site is under construction. We'll be launching soon!
          </p>

          <section className="contact-section" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="contact-heading">
              Get in Touch
            </h2>
            <p className="contact-info">
              Email us at:{" "}
              <a
                href="mailto:contact@angelpixel.io"
                className="contact-link"
                aria-label="Send email to contact at angelpixel dot io"
              >
                contact@angelpixel.io
              </a>
            </p>
            <p className="contact-info">
              Connect with us on{" "}
              <a
                href="https://www.linkedin.com/in/angelszymczak"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                aria-label="Visit Angel Szymczak's LinkedIn profile (opens in new tab)"
              >
                LinkedIn
              </a>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}