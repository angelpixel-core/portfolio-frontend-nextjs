"use client";

import "./styles.css";

import { default as NextLink } from "next/link";
import WhatsAppIcon from "@/atoms/icons/WhatsAppIcon";
import { useProfile } from "@/domains/profile/queries";

interface LinkProps {
  text?: string;
}

/**
 * Link - WhatsApp contact link component
 * Story 5.2: WhatsApp Contact
 *
 * Uses wa.me format for universal WhatsApp links.
 * Opens WhatsApp app on mobile, WhatsApp Web on desktop.
 */
const Link = ({ text }: LinkProps) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // Graceful fallback: return null when data not available
  // Avoids broken href="#" which is poor UX
  if (isLoading || isError || !profile?.whatsapp) {
    return null;
  }

  const whatsappUrl = profile.whatsapp;

  return (
    <>
      <NextLink
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp_link"
        aria-label="Contact via WhatsApp"
        data-testid="contact-whatsapp-link"
      >
        {text}
      </NextLink>

      <NextLink
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp_icon-container"
        aria-label="Contact via WhatsApp"
      >
        <WhatsAppIcon className="whatsapp_link-icon" />
      </NextLink>
    </>
  );
};

export default Link;
