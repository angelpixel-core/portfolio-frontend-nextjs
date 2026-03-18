"use client";

import "./styles.css";

import { useEffect, useState } from "react";
import { default as NextLink } from "next/link";
import TelegramIcon from "@/atoms/icons/TelegramIcon";
import { useProfile } from "@/domains/profile/queries";

interface LinkProps {
  text?: string;
}

/**
 * Link - Telegram contact link component
 * Story 5.2: Telegram Contact
 *
 * Uses t.me format for universal Telegram links.
 * Opens Telegram app on mobile, Telegram Web on desktop.
 */
const Link = ({ text }: LinkProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: profile,
    isLoading,
    isError,
  } = useProfile(1, {
    enabled: isMounted,
  });

  // Graceful fallback: return null when data not available
  // Avoids broken href="#" which is poor UX
  if (!isMounted || isLoading || isError || !profile?.telegram) {
    return null;
  }

  const telegramUrl = profile.telegram;

  return (
    <NextLink
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="telegram__entry"
      aria-label="Contact via Telegram"
      data-testid="contact-telegram-link"
    >
      <TelegramIcon className="telegram__link-icon" />
      <span>{text}</span>
    </NextLink>
  );
};

export default Link;
