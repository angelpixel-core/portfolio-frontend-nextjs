"use client";

import "./styles.css";

import { useState, useRef, useEffect } from "react";
import {
  LinkedInIcon,
  MicrosoftIcon,
  GooglePlusIcon,
  EnvelopeIcon,
} from "@/icons";

interface SocialAuthDropdownProps {
  onSelect?: (_provider: string) => void;
}

/**
 * SocialAuthDropdown - Envelope icon that expands to show social auth options
 *
 * Used in contact forms (Say Hello) to allow quick social login/contact.
 * Shows LinkedIn, Microsoft, Google options in a floating dropdown.
 */
const SocialAuthDropdown = ({ onSelect }: SocialAuthDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (provider: string) => {
    onSelect?.(provider);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="social-auth-dropdown" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className="social-auth-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Social authentication options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <EnvelopeIcon className="h-5 w-5" />
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="social-auth-dropdown__menu" role="menu">
          <button
            type="button"
            className="social-auth-dropdown__item"
            onClick={() => handleSelect("linkedin")}
            aria-label="Continue with LinkedIn"
            role="menuitem"
          >
            <LinkedInIcon className="h-5 w-5" />
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            className="social-auth-dropdown__item"
            onClick={() => handleSelect("microsoft")}
            aria-label="Continue with Microsoft"
            role="menuitem"
          >
            <MicrosoftIcon className="h-5 w-5" />
            <span>Microsoft</span>
          </button>

          <button
            type="button"
            className="social-auth-dropdown__item"
            onClick={() => handleSelect("google")}
            aria-label="Continue with Google"
            role="menuitem"
          >
            <GooglePlusIcon className="h-5 w-5" />
            <span>Google</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialAuthDropdown;
