"use client";

import "./styles.css";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import MicrosoftIcon from "@/atoms/icons/MicrosoftIcon";
import GooglePlusIcon from "@/atoms/icons/GooglePlusIcon";
import EnvelopeIcon from "@/atoms/icons/EnvelopeIcon";
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { OAuthProvider } from "@/services/auth/types";
import { authClient } from "@/lib/auth-client";

type Provider = OAuthProvider | null;
const isOAuthEnabled = process.env.NEXT_PUBLIC_OAUTH_ENABLED === "true";
const pendingProviderKey = "oauth:pending-provider";
const returnUrlKey = "oauth:return-url";

const getProviderId = (provider: Provider): string | null => {
  if (!provider) return null;
  return provider;
};

interface SocialAuthDropdownProps {
  onEmailFetched?: (_email: string, _provider: Provider) => void;
  onEmailCleared?: () => void;
  disabledProviders?: OAuthProvider[];
}

/** Clear/X Icon for reset state */
const ClearIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * SocialAuthDropdown - Envelope icon that expands to show social auth options
 *
 * Behavior:
 * - Initially shows envelope icon
 * - On provider selection: icon changes to selected provider
 * - On hover when selected: shows X/clear icon
 * - Click when selected: clears email and resets to envelope
 * - Shows loading state while "fetching" email
 *
 * Future: Will integrate with real OAuth providers
 */
const SocialAuthDropdown = ({
  onEmailFetched,
  onEmailCleared,
  disabledProviders,
}: SocialAuthDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // Suppress clear icon until mouse leaves after loading
  const [suppressClear, setSuppressClear] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Dropdown animation variants - expand/collapse from top
  const menuVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: {
          opacity: 0,
          scaleY: 0,
          originY: 0,
        },
        visible: {
          opacity: 1,
          scaleY: 1,
          originY: 0,
          transition: {
            duration: 0.2,
            ease: "easeOut",
            staggerChildren: 0.05,
          },
        },
        exit: {
          opacity: 0,
          scaleY: 0,
          originY: 0,
          transition: {
            duration: 0.15,
            ease: "easeIn",
          },
        },
      };

  // Individual item animation variants
  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: -8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.15 },
        },
      };

  const { data: session } = authClient.useSession();

  const handleSelect = async (provider: Provider) => {
    if (!provider) return;
    if (disabledProviders?.includes(provider)) return;

    const providerId = getProviderId(provider);
    if (!providerId) return;

    setIsOpen(false);
    setSelectedProvider(provider);
    setIsLoading(true);
    // Suppress clear icon until mouse leaves
    setSuppressClear(true);

    if (!isOAuthEnabled) {
      setIsLoading(false);
      setTimeout(() => setSuppressClear(false), 300);
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(pendingProviderKey, provider);
      window.localStorage.setItem(returnUrlKey, window.location.href);
    }

    await authClient.signIn.social({
      provider: providerId as OAuthProvider,
      callbackURL: window.location.href,
    });
  };

  const handleReset = () => {
    setSelectedProvider(null);
    setIsLoading(false);
    onEmailCleared?.();
  };

  const handleTriggerClick = () => {
    if (selectedProvider) {
      // If provider selected, clear it
      handleReset();
    } else {
      // Toggle dropdown
      setIsOpen(!isOpen);
    }
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

  useEffect(() => {
    if (!isOAuthEnabled || typeof window === "undefined") return;
    const pendingProvider = window.localStorage.getItem(pendingProviderKey);
    if (!pendingProvider) return;
    if (disabledProviders?.includes(pendingProvider as OAuthProvider)) {
      window.localStorage.removeItem(pendingProviderKey);
      window.localStorage.removeItem(returnUrlKey);
      return;
    }

    if (session?.user?.email) {
      onEmailFetched?.(session.user.email, pendingProvider as OAuthProvider);
      setSelectedProvider(pendingProvider as OAuthProvider);
      window.localStorage.removeItem(pendingProviderKey);
      const returnUrl = window.localStorage.getItem(returnUrlKey);
      if (returnUrl) {
        window.localStorage.removeItem(returnUrlKey);
        if (
          returnUrl.startsWith(window.location.origin) &&
          returnUrl !== window.location.href
        ) {
          window.location.assign(returnUrl);
        }
      }
      setIsLoading(false);
      setTimeout(() => setSuppressClear(false), 300);
    }
  }, [disabledProviders, onEmailFetched, session?.user?.email]);

  // Get the icon to display based on state
  const renderTriggerIcon = () => {
    if (isLoading) {
      return (
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    // Show clear icon on hover when provider is selected (unless suppressed)
    if (selectedProvider && isHovering && !suppressClear) {
      return <ClearIcon className="h-5 w-5" />;
    }

    switch (selectedProvider) {
      case "github":
        return <GitHubIcon className="h-5 w-5" />;
      case "linkedin":
        return <LinkedInIcon className="h-5 w-5" />;
      case "microsoft":
        return <MicrosoftIcon className="h-5 w-5" />;
      case "google":
        return <GooglePlusIcon className="h-5 w-5" />;
      default:
        return <EnvelopeIcon className="h-5 w-5" />;
    }
  };

  // Get button style modifier based on selected provider
  const getProviderModifier = () => {
    if (isLoading) return "social-auth-dropdown__trigger--loading";
    // Show clear style on hover when selected (unless suppressed)
    if (selectedProvider && isHovering && !suppressClear)
      return "social-auth-dropdown__trigger--clear";
    switch (selectedProvider) {
      case "github":
        return "social-auth-dropdown__trigger--github";
      case "linkedin":
        return "social-auth-dropdown__trigger--linkedin";
      case "microsoft":
        return "social-auth-dropdown__trigger--microsoft";
      case "google":
        return "social-auth-dropdown__trigger--google";
      default:
        return "";
    }
  };

  return (
    <div className="social-auth-dropdown" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`social-auth-dropdown__trigger ${getProviderModifier()}`}
        onClick={handleTriggerClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          // Allow clear icon to show on next hover
          setSuppressClear(false);
        }}
        onFocus={() => setIsHovering(true)}
        onBlur={() => {
          setIsHovering(false);
          setSuppressClear(false);
        }}
        aria-label={
          selectedProvider
            ? `Connected with ${selectedProvider}. Click to clear.`
            : "Social authentication options"
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
        disabled={isLoading}
      >
        {renderTriggerIcon()}
      </button>

      {/* Animated Dropdown - Icons only */}
      <AnimatePresence>
        {isOpen && !selectedProvider && (
          <m.div
            className="social-auth-dropdown__menu"
            role="menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {!disabledProviders?.includes("github") && (
              <m.button
                type="button"
                className="social-auth-dropdown__item"
                onClick={() => handleSelect("github")}
                aria-label="Continue with GitHub"
                role="menuitem"
                variants={itemVariants}
              >
                <GitHubIcon className="h-6 w-6" />
              </m.button>
            )}

            {!disabledProviders?.includes("linkedin") && (
              <m.button
                type="button"
                className="social-auth-dropdown__item"
                onClick={() => handleSelect("linkedin")}
                aria-label="Continue with LinkedIn"
                role="menuitem"
                variants={itemVariants}
              >
                <LinkedInIcon className="h-6 w-6" />
              </m.button>
            )}

            {!disabledProviders?.includes("microsoft") && (
              <m.button
                type="button"
                className="social-auth-dropdown__item"
                onClick={() => handleSelect("microsoft")}
                aria-label="Continue with Microsoft"
                role="menuitem"
                variants={itemVariants}
              >
                <MicrosoftIcon className="h-6 w-6" />
              </m.button>
            )}

            {!disabledProviders?.includes("google") && (
              <m.button
                type="button"
                className="social-auth-dropdown__item"
                onClick={() => handleSelect("google")}
                aria-label="Continue with Google"
                role="menuitem"
                variants={itemVariants}
              >
                <GooglePlusIcon className="h-6 w-6" />
              </m.button>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialAuthDropdown;
