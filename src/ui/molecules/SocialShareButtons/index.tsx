"use client";

import React from "react";
import "./styles.css";

export interface SocialShareButtonsProps {
  /** Full article URL to share */
  url: string;
  /** Article title for share text */
  title: string;
  /** Optional summary for platforms that support it */
  summary?: string;
}

/**
 * Opens a centered popup window for social sharing
 * @param url - The share URL to open
 * @param windowName - Name for the popup window
 * @param width - Popup width (default: 600)
 * @param height - Popup height (default: 400)
 */
const openSharePopup = (
  url: string,
  windowName: string,
  width = 600,
  height = 400
): void => {
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  window.open(
    url,
    windowName,
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
  );
};

/**
 * SocialShareButtons - Share buttons for Twitter/X and LinkedIn
 *
 * Story 4.3: Social Sharing
 * - Opens share dialogs in popup windows (not leaving the page)
 * - Keyboard accessible with proper aria-labels
 * - Uses official share intent URLs for each platform
 */
export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
}) => {
  const handleTwitterShare = () => {
    const twitterUrl = new URL("https://twitter.com/intent/tweet");
    twitterUrl.searchParams.set("text", title);
    twitterUrl.searchParams.set("url", url);
    openSharePopup(twitterUrl.toString(), "twitter-share");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = new URL(
      "https://www.linkedin.com/sharing/share-offsite/"
    );
    linkedInUrl.searchParams.set("url", url);
    openSharePopup(linkedInUrl.toString(), "linkedin-share");
  };

  return (
    <div className="social-share-buttons">
      <span className="social-share-buttons__label">Share:</span>
      <button
        type="button"
        onClick={handleTwitterShare}
        aria-label="Share on Twitter"
        className="social-share-buttons__button social-share-buttons__button--twitter"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="social-share-buttons__icon"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleLinkedInShare}
        aria-label="Share on LinkedIn"
        className="social-share-buttons__button social-share-buttons__button--linkedin"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="social-share-buttons__icon"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
    </div>
  );
};

export default SocialShareButtons;
